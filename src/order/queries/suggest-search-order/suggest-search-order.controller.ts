import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { SuggestSearchOrderQuery } from './suggest-search-order.query';
import { SuggestSearchOrderQueryDto } from './suggest-search-order.query.dto';

@Controller()
export class SuggestSearchOrderController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.search.suggest')
  async handler(@Query() qs: SuggestSearchOrderQueryDto): Promise<any> {
    const query = new SuggestSearchOrderQuery({
      ...qs,
    });
    return this.queryBus.execute(query);
  }
}
