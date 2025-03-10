import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wo-sdk/nest-http';

import { ListOrdersQuery } from './list-orders.query';
import { ListOrdersQueryDto } from './list-orders.query.dto';

@Controller()
export class ListOrdersController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.list')
  async handler(
    @Query() qs: ListOrdersQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new ListOrdersQuery({
      ...qs,
      identity,
      isDelivered: qs.is_delivered,
    });
    return this.queryBus.execute(query);
  }
}
