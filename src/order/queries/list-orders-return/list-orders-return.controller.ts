import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Identity } from '@wings-corporation/nest-http';
import { UserIdentity } from '@wings-online/common';

import { ListOrdersReturnQuery } from './list-orders-return.query';
import { ListOrdersReturnQueryDto } from './list-orders-return.query.dto';

@Controller()
export class ListOrdersReturnController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.return.list')
  async handler(
    @Query() qs: ListOrdersReturnQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new ListOrdersReturnQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
