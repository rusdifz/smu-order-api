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

import { ListOrdersReturnQuery } from './list-orders-return.query';
import { ListOrdersReturnResult } from './list-orders-return.result';

@QueryHandler(ListOrdersReturnQuery)
export class ListOrdersReturnHandler
  implements IQueryHandler<ListOrdersReturnQuery, ListOrdersReturnResult>
{
  constructor(
    @InjectPinoLogger(ListOrdersReturnHandler.name)
    readonly logger: PinoLogger,
    @Inject(SFA_SERVICE)
    private readonly SfaService: ISfaService,
    @Inject(ORDER_READ_REPOSITORY)
    readonly repository: IOrderReadRepository,
  ) {}

  async execute(query: ListOrdersReturnQuery): Promise<ListOrdersReturnResult> {
    // this.logger.trace(`BEGIN`);
    // this.logger.info({ query });

    let queryTime: number | undefined;
    queryTime = performance.now();

    const { docNo, limit, page, identity } = query;
    if (!identity.externalId)
      throw createBadRequestException('custid-is-required');

    const order = await this.SfaService.listReturnOrder({
      custId: identity.externalId,
      docNo,
      limit,
      page,
    });

    const materialId = order.data.listData.flatMap((ent) => {
      return ent.details.map((item) => item.materialId);
    });

    const userType = identity.externalId.includes('WS') ? 'WS' : 'SMU';

    const materialForSFA = await this.repository.listMaterialForSFA(
      userType,
      materialId,
    );

    if (!order)
      throw createBadRequestException(
        'something-wrong-happened-with-sfa-service',
      );

    // queryTime = performance.now() - queryTime;
    // this.logger.info({ queryTime }, 'list-order-return-query');

    // this.logger.trace(`END`);
    return new ListOrdersReturnResult(materialForSFA, order);
  }
}
