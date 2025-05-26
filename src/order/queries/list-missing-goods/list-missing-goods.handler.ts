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

import { ListMissingGoodsQuery } from './list-missing-goods.query';
import { ListMissingGoodsResult } from './list-missing-goods.result';

@QueryHandler(ListMissingGoodsQuery)
export class ListMissingGoodsHandler
  implements IQueryHandler<ListMissingGoodsQuery, ListMissingGoodsResult>
{
  constructor(
    @InjectPinoLogger(ListMissingGoodsHandler.name)
    readonly logger: PinoLogger,
    @Inject(SFA_SERVICE)
    private readonly SfaService: ISfaService,
    @Inject(ORDER_READ_REPOSITORY)
    readonly repository: IOrderReadRepository,
  ) {}

  async execute(query: ListMissingGoodsQuery): Promise<ListMissingGoodsResult> {
    // this.logger.trace(`BEGIN`);
    // this.logger.info({ query });

    let queryTime: number | undefined;
    queryTime = performance.now();

    const { docNo, limit, page, identity } = query;
    if (!identity.externalId)
      throw createBadRequestException('custid-is-required');

    const order = await this.SfaService.listMissingGoods({
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
    // return order;
    return new ListMissingGoodsResult(order);
  }
}
