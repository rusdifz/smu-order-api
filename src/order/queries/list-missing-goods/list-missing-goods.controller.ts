import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Identity } from '@wings-corporation/nest-http';
import { UserIdentity } from '@wings-online/common';

import { ListMissingGoodsQuery } from './list-missing-goods.query';
import { ListMissingGoodsQueryDto } from './list-missing-goods.query.dto';

@Controller()
export class ListMissingGoodsController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/orders.missing.goods.list')
  async handler(
    @Query() qs: ListMissingGoodsQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new ListMissingGoodsQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
