import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wo-sdk/nest-http';

import { GetInvoiceOverdueQuery } from './get-invoice-overdue.query';

@Controller()
export class GetInvoiceOverdueController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/invoice.overdue.info')
  async handler(@Identity() identity: UserIdentity): Promise<any> {
    const query = new GetInvoiceOverdueQuery({
      identity,
    });
    return this.queryBus.execute(query);
  }
}
