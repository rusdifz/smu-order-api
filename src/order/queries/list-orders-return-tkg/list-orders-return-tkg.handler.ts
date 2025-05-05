import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InjectPinoLogger,
  PinoLogger,
} from '@wings-corporation/nest-pino-logger';
import {
  IOrderReadRepository,
  ISfaService
} from '@wings-online/order/interfaces';
import {
  ORDER_READ_REPOSITORY,
  SFA_SERVICE
} from '@wings-online/order/order.constants';

import { createBadRequestException } from '@wings-online/common';
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

  async execute(query: ListOrdersReturnTkgQuery): Promise<ListOrdersReturnTkgResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    let queryTime: number | undefined;
    queryTime = performance.now();

    const { 
      docNo, 
      limitSFA, 
      limitWO,
      limitWOHist,
      page, 
      identity 
    } = query;
    if (!identity.externalId) throw createBadRequestException('custid-is-required');

    const orderSFA = await this.SfaService.listReturnTkg({
      custId: identity.externalId,
      docNo,
      limit: limitSFA, 
      page, 
    });
    if (!orderSFA) throw createBadRequestException('something-wrong-happened-with-sfa-service');
    queryTime = performance.now() - queryTime;
    this.logger.info({ queryTime }, 'list-order-return-tkg-query-from-sfa');

    const [orderWO, orderWOHist] = await Promise.all([
      this.repository.listOrderReturn(
        identity,
        {
          docNo
        },
        {
          limit: limitWO,
          page,
        },
      ),
      this.repository.listOrderHistoryReturn(
        identity,
        {
          docNo
        },
        {
          limit: limitWOHist,
          page,
        },
      )
    ]);
    
    queryTime = performance.now() - queryTime;
    this.logger.info({ queryTime }, 'list-order-return-tkg-query-from-wo');

    this.logger.trace(`END`);
    return new ListOrdersReturnTkgResult(orderSFA, orderWO, orderWOHist);
  }
}
