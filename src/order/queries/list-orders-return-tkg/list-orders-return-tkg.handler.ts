import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InjectPinoLogger,
  PinoLogger,
} from '@wings-corporation/nest-pino-logger';
import {
  ISfaService
} from '@wings-online/order/interfaces';
import {
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
  ) {}

  async execute(query: ListOrdersReturnTkgQuery): Promise<ListOrdersReturnTkgResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    let queryTime: number | undefined;
    queryTime = performance.now();

    const { docNo, identity } = query;
    if (!identity.externalId) throw createBadRequestException('custid-is-required');

    const order = await this.SfaService.listReturnTkg({
      custId: identity.externalId,
      docNo
    });
    if (!order) throw createBadRequestException('something-wrong-happened-with-sfa');
    console.log('ditto', order);

    queryTime = performance.now() - queryTime;
    this.logger.info({ queryTime }, 'list-order-query');

    this.logger.trace(`END`);
    return new ListOrdersReturnTkgResult(order);
  }
}
