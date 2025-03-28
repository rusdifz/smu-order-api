import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Identity } from '@wings-corporation/nest-http';
import { UserIdentity } from '@wings-online/common';

import { GetOrderHistoryInfoQuery } from './get-order-history-info.query';
import { GetOrderHistoryInfoQueryDto } from './get-order-history-info.query.dto';

@Controller()
export class GetOrderHistoryInfoController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.history.detail')
  async handler(
    @Query() qs: GetOrderHistoryInfoQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new GetOrderHistoryInfoQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
