import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Identity } from '@wings-corporation/nest-http';
import { UserIdentity } from '@wings-online/common';

import { GetOrderStatusHistoryQuery } from './get-order-status-history.query';
import { GetOrderStatusHistoryQueryDto } from './get-order-status-history.query.dto';

@Controller()
export class GetOrderStatusHistoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.status-history.list')
  async handler(
    @Query() qs: GetOrderStatusHistoryQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new GetOrderStatusHistoryQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
