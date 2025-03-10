import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IProductSearchReadRepository } from '@wings-online/order/interfaces';
import { PRODUCT_SEARCH_READ_REPOSITORY } from '@wings-online/order/order.constants';
import { InjectPinoLogger, PinoLogger } from '@wo-sdk/nest-pino-logger';

import { SuggestSearchOrderQuery } from './suggest-search-order.query';
import { SuggestSearchOrderResult } from './suggest-search-order.result';

@QueryHandler(SuggestSearchOrderQuery)
export class SuggestSearchOrderHandler
  implements IQueryHandler<SuggestSearchOrderQuery, SuggestSearchOrderResult>
{
  constructor(
    @InjectPinoLogger(SuggestSearchOrderHandler.name)
    private readonly logger: PinoLogger,
    @Inject(PRODUCT_SEARCH_READ_REPOSITORY)
    private readonly searchRepository: IProductSearchReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(
    query: SuggestSearchOrderQuery,
  ): Promise<SuggestSearchOrderResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const suggestedSearch = await this.searchRepository.spellCheck(
      query.search,
    );

    this.logger.trace(`END`);
    return new SuggestSearchOrderResult({
      is_same: query.search === suggestedSearch,
      old_search: query.search,
      suggested_search: suggestedSearch,
    });
  }
}
