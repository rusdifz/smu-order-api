import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wings-corporation/nest-http';

import { GetOrderInfoQuery } from './get-order-info.query';
import { GetOrderInfoQueryDto } from './get-order-info.query.dto';

@Controller()
export class GetOrderInfoController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.detail')
  async handler(
    @Query() qs: GetOrderInfoQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new GetOrderInfoQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
