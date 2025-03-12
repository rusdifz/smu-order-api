import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wings-corporation/nest-http';

import { ListOrderHistoryQuery } from './list-order-history.query';
import { ListOrderHistoryQueryDto } from './list-order-history.query.dto';

@Controller()
export class ListOrderHistoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.history.list')
  async handler(
    @Query() qs: ListOrderHistoryQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new ListOrderHistoryQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
