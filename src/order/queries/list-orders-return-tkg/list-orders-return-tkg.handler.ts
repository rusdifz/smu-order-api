import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InjectPinoLogger,
  PinoLogger,
} from '@wings-corporation/nest-pino-logger';
import { createBadRequestException } from '@wings-online/common';
import {
  IOrderReadRepository,
  ISfaService,
} from '@wings-online/order/interfaces';
import {
  ORDER_READ_REPOSITORY,
  OrderStatus,
  SFA_SERVICE,
} from '@wings-online/order/order.constants';

import { ListOrdersReturnTkgQuery } from './list-orders-return-tkg.query';
import { ListOrdersReturnTkgResult } from './list-orders-return-tkg.result';

@QueryHandler(ListOrdersReturnTkgQuery)
export class ListOrdersReturnTkgHandler
  implements IQueryHandler<ListOrdersReturnTkgQuery, ListOrdersReturnTkgResult>
{
  constructor(
    @InjectPinoLogger(ListOrdersReturnTkgHandler.name)
    readonly logger: PinoLogger,
    @Inject(SFA_SERVICE)
    private readonly SfaService: ISfaService,
    @Inject(ORDER_READ_REPOSITORY)
    readonly repository: IOrderReadRepository,
  ) {}

  async execute(
    query: ListOrdersReturnTkgQuery,
  ): Promise<ListOrdersReturnTkgResult> {
    // this.logger.trace(`BEGIN`);
    // this.logger.info({ query });

    let queryTime: number | undefined;
    queryTime = performance.now();

    const { docNo, limit, page, sortDocDate, status, identity } = query;
    if (!identity.externalId)
      throw createBadRequestException('custid-is-required');

    // Map status string array like ['1', '2', '3A'] to OrderStatus enum values
    const statuses = (status?.split(',') ?? [])
      .map((s: string) => {
        switch (s) {
          case '0':
            return OrderStatus.NOT_CONFIRMED;
          case '1':
            return OrderStatus.CONFIRMED;
          case '1C':
            return OrderStatus.CANCELLED_BY_CUSTOMER;
          case '2':
            return OrderStatus.PROCESSING;
          case '3A':
            return OrderStatus.PREPARING_A;
          case '3B':
            return OrderStatus.PREPARING_B;
          case '3C':
            return OrderStatus.CANCELLED_BY_SYSTEM;
          case '4':
            return OrderStatus.SHIPPED;
          case '5':
            return OrderStatus.ARRIVED;
          case '6':
            return OrderStatus.RECEIVED;
          case '7':
            return OrderStatus.RECEIVED_PARTIALLY;
          case '8':
            return OrderStatus.RETURNED;
          case '9':
            return OrderStatus.DELIVERY_FAILED;
          default:
            return undefined;
        }
      })
      .filter((s) => s !== undefined);
    
    const isFinish: boolean = 
      statuses.includes(OrderStatus.CANCELLED_BY_CUSTOMER)
      || statuses.includes(OrderStatus.CANCELLED_BY_SYSTEM)
      || statuses.includes(OrderStatus.RECEIVED)
      || statuses.includes(OrderStatus.RECEIVED_PARTIALLY)
      || statuses.includes(OrderStatus.RETURNED)
      || statuses.includes(OrderStatus.DELIVERY_FAILED)
      || statuses.length === 0;
    
    let orderSFA: any | null = null;
    let materialId: string[] = [];
    if (isFinish) {
      this.logger.info({ queryTime }, 'list-order-return-tkg-query-from-sfa');
    
      orderSFA = await this.SfaService.listReturnTkg({
        custId: identity.externalId,
        docNo,
        limit: limit,
        page,
        sortDocDate,
      });
      if (!orderSFA)
        throw createBadRequestException(
          'something-wrong-happened-with-sfa-service',
        );
        
      materialId = orderSFA?.data?.listData.flatMap((ent) => {
        return ent.details.map((item: { materialId: string }) => item.materialId);
      }) ?? [];
    }

    const userType = identity.externalId.includes('WS') ? 'WS' : 'SMU';

    const [parameters, materialForSFA, orderWO, orderWOHist] =
      await Promise.all([
      this.repository.parameters(),
      materialId.length > 0 ? this.repository.listMaterialForSFA(userType, materialId) : [],
      this.repository.listOrderReturn(
        identity,
        {
          docNo,
          statuses,
        },
        {
          docDate: sortDocDate,
        },
        {
          limit: limit,
          page,
        },
      ),
      this.repository.listOrderHistoryReturn(
        identity,
        {
          docNo,
          statuses,
        },
        {
          docDate: sortDocDate,
        },
        {
          limit: limit,
          page,
        },
      ),
      ]);

    // queryTime = performance.now() - queryTime;
    // this.logger.info({ queryTime }, 'list-order-return-tkg-query-from-wo');

    // this.logger.trace(`END`);
    // return orderSFA;
    return new ListOrdersReturnTkgResult(
      parameters,
      materialForSFA,
      page,
      limit,
      orderSFA,
      orderWO,
      orderWOHist,
      sortDocDate,
    );
  }
}
