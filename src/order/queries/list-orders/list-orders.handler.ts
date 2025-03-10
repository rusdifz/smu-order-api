import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { createBadRequestException } from '@wings-online/common';
import {
  IOrderReadRepository,
  IProductSearchReadRepository,
} from '@wings-online/order/interfaces';
import {
  ORDER_READ_REPOSITORY,
  PRODUCT_SEARCH_READ_REPOSITORY,
} from '@wings-online/order/order.constants';
import { InjectPinoLogger, PinoLogger } from '@wo-sdk/nest-pino-logger';

import { ListOrdersQuery } from './list-orders.query';
import { ListOrdersResult } from './list-orders.result';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler
  implements IQueryHandler<ListOrdersQuery, ListOrdersResult>
{
  constructor(
    @InjectPinoLogger(ListOrdersHandler.name)
    readonly logger: PinoLogger,
    @Inject(ORDER_READ_REPOSITORY)
    readonly repository: IOrderReadRepository,
    @Inject(PRODUCT_SEARCH_READ_REPOSITORY)
    private readonly searchRepository: IProductSearchReadRepository,
  ) {}

  async execute(query: ListOrdersQuery): Promise<ListOrdersResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const { identity, isDelivered, limit, cursor } = query;

    let externalIds: string[] | undefined;

    if (query.search) {
      const products = await this.searchRepository.search({
        search: query.search,
        // TODO change this to env vars
        // @BEN we limit result at 70, see https://postgres.cz/wiki/PostgreSQL_SQL_Tricks_I#Predicate_IN_optimalization
        limit: 70,
      });
      externalIds = products.map((product) => product.external_id);

      if (products.length === 0) {
        throw createBadRequestException('product-search-empty');
      }
    }

    const state =
      isDelivered === true
        ? 'DELIVERED'
        : isDelivered === false
        ? 'UNDELIVERED'
        : 'ANY';

    const orders = await this.repository.listOrders(
      identity,
      {
        state,
        externalIds,
      },
      {
        limit,
        cursor,
      },
    );

    this.logger.trace(`END`);
    return new ListOrdersResult(orders);
  }
}
