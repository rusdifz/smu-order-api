import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InjectPinoLogger,
  PinoLogger,
} from '@wings-corporation/nest-pino-logger';
import {
  IOrderReadRepository,
  IProductSearchReadRepository,
} from '@wings-online/order/interfaces';
import {
  ORDER_READ_REPOSITORY,
  PRODUCT_SEARCH_READ_REPOSITORY,
} from '@wings-online/order/order.constants';

import { ListOrderHistoryQuery } from './list-order-history.query';
import { ListOrderHistoryResult } from './list-order-history.result';

@QueryHandler(ListOrderHistoryQuery)
export class ListOrderHistoryHandler
  implements IQueryHandler<ListOrderHistoryQuery, ListOrderHistoryResult>
{
  constructor(
    @InjectPinoLogger(ListOrderHistoryHandler.name)
    readonly logger: PinoLogger,
    @Inject(ORDER_READ_REPOSITORY)
    readonly repository: IOrderReadRepository,
    @Inject(PRODUCT_SEARCH_READ_REPOSITORY)
    private readonly searchRepository: IProductSearchReadRepository,
  ) {}

  async execute(query: ListOrderHistoryQuery): Promise<ListOrderHistoryResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const { identity, limit, cursor, search } = query;

    // let externalIds: string[] | undefined;
    // if (search) {
    //   const products = await this.searchRepository.search({
    //     search,
    //     // TODO move this to env vars
    //     // @BEN we limit result at 70, see https://postgres.cz/wiki/PostgreSQL_SQL_Tricks_I#Predicate_IN_optimalization
    //     limit: 70,
    //   });
    //   externalIds = products.map((product) => product.external_id);

    //   if (products.length === 0) {
    //     throw createBadRequestException('product-search-empty');
    //   }
    // }

    let queryTime: number | undefined;
    queryTime = performance.now();

    const collection = await this.repository.listOrderHistories(
      identity,
      {
        //externalIds,
        keyword: search,
      },
      {
        limit,
        cursor,
      },
    );

    queryTime = performance.now() - queryTime;
    this.logger.info({ queryTime }, 'list-order-history-query');

    this.logger.trace(`END`);
    return new ListOrderHistoryResult(collection);
  }
}
