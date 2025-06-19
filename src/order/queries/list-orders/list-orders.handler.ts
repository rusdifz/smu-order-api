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

import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';
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
    private readonly parameterService: ParameterService,
  ) {}

  async execute(query: ListOrdersQuery): Promise<ListOrdersResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const { identity, isDelivered, limit, cursor, search } = query;

    // if (query.search) {
    //   searchTime = performance.now();
    //   const products = await this.searchRepository.search({
    //     search: query.search,
    //     limit: 70,
    //   });
    //   externalIds = products.map((product) => product.external_id);

    //   if (products.length === 0) {
    //     throw createBadRequestException('product-search-empty');
    //   }
    //   searchTime = performance.now() - searchTime;
    // }

    let queryTime: number | undefined;
    queryTime = performance.now();

    const state =
      isDelivered === true
        ? 'DELIVERED'
        : isDelivered === false
        ? 'UNDELIVERED'
        : 'ANY';

    queryTime = performance.now();
    const excludeDocTypes: string[] = [];
    const [docTypeTkgIn, docTypeTKgOut] = await Promise.all([
      this.parameterService.getOne(ParameterKeys.TKG_WO_IN_ORDER_TYPE),
      this.parameterService.getOne(ParameterKeys.TKG_WO_OUT_ORDER_TYPE),
    ]);

    if(docTypeTkgIn){
      excludeDocTypes.push(docTypeTkgIn.value);
    }
    if(docTypeTKgOut){
      excludeDocTypes.push(docTypeTKgOut.value);
    }

    const orders = await this.repository.listOrders(
      identity,
      {
        state,
        // externalIds,
        keyword: search,
        excludeDocTypes
      },
      {
        limit,
        cursor,
      },
    );
    queryTime = performance.now() - queryTime;
    this.logger.info({ queryTime }, 'list-order-query');

    this.logger.trace(`END`);
    return new ListOrdersResult(orders);
  }
}
