import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Identity } from '@wings-corporation/nest-http';
import { UserIdentity } from '@wings-online/common';

import { ListOrdersReturnTkgQuery } from './list-orders-return-tkg.query';
import { ListOrdersReturnTkgQueryDto } from './list-orders-return-tkg.query.dto';

@Controller()
export class ListOrdersReturnTkgController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.return.tkg.list')
  async handler(
    @Query() qs: ListOrdersReturnTkgQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new ListOrdersReturnTkgQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
