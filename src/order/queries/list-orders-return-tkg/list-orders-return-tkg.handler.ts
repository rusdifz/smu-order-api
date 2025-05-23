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

    const { docNo, limit, page, identity } = query;
    if (!identity.externalId)
      throw createBadRequestException('custid-is-required');

    const orderSFA = await this.SfaService.listReturnTkg({
      custId: identity.externalId,
      docNo,
      limit: limit,
      page,
    });
    if (!orderSFA)
      throw createBadRequestException(
        'something-wrong-happened-with-sfa-service',
      );

    // queryTime = performance.now() - queryTime;
    // this.logger.info({ queryTime }, 'list-order-return-tkg-query-from-sfa');

    const materialId = orderSFA.data.listData.flatMap((ent) => {
      return ent.details.map((item) => item.materialId);
    });

    const userType = identity.externalId.includes('WS') ? 'WS' : 'SMU';

    const [parameters, materialForSFA, orderWO, orderWOHist] =
      await Promise.all([
        this.repository.parameters(),
        this.repository.listMaterialForSFA(userType, materialId),
        this.repository.listOrderReturn(
          identity,
          {
            docNo,
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
    return new ListOrdersReturnTkgResult(
      parameters,
      materialForSFA,
      page,
      limit,
      orderSFA,
      orderWO,
      orderWOHist,
    );
  }
}
