import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wo-sdk/nest-http';

import { ListInvoicesQuery } from './list-invoices.query';
import { ListInvoicesQueryDto } from './list-invoices.query.dto';

@Controller()
export class ListInvoicesController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/invoices.list')
  async handler(
    @Query() qs: ListInvoicesQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new ListInvoicesQuery({
      ...qs,
      identity,
    });
    return this.queryBus.execute(query);
  }
}
