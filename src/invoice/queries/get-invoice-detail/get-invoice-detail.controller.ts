import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wings-corporation/nest-http';

import { GetInvoiceDetailQuery } from './get-invoice-detail.query';
import { GetInvoiceDetailQueryDto } from './get-invoice-detail.query.dto';

@Controller()
export class GetInvoiceDetailController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('/invoice.info')
  async handler(
    @Query() qs: GetInvoiceDetailQueryDto,
    @Identity() identity: UserIdentity,
  ): Promise<any> {
    const query = new GetInvoiceDetailQuery({
      identity,
      invoiceNumber: qs.invoice_number,
    });
    return this.queryBus.execute(query);
  }
}
