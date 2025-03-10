import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IInvoiceReadRepository } from '@wings-online/invoice/interfaces';
import { INVOICE_READ_REPOSITORY } from '@wings-online/invoice/invoice.constants';
import { InvoiceOverdueReadModel } from '@wings-online/invoice/read-models';

import { GetInvoiceOverdueQuery } from './get-invoice-overdue.query';
import { GetInvoiceOverdueResult } from './get-invoice-overdue.result';

@QueryHandler(GetInvoiceOverdueQuery)
export class GetInvoiceOverdueHandler
  implements IQueryHandler<GetInvoiceOverdueQuery, GetInvoiceOverdueResult>
{
  constructor(
    @InjectPinoLogger(GetInvoiceOverdueHandler.name)
    private readonly logger: PinoLogger,
    @Inject(INVOICE_READ_REPOSITORY)
    private readonly repository: IInvoiceReadRepository,
  ) {}

  async execute(
    query: GetInvoiceOverdueQuery,
  ): Promise<GetInvoiceOverdueResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const { identity } = query;

    const invoices = await this.repository.listOverdueInvoices(identity);
    const res = new InvoiceOverdueReadModel({
      overdueAmount: invoices
        .filter((x) => x.isOverdue)
        .reduce((total, current) => total + current.props.amount, 0),
      overdueCount: invoices.filter((x) => x.isOverdue).length,
      total: invoices.reduce(
        (total, current) => total + current.props.amount,
        0,
      ),
    });
    this.logger.trace(`END`);

    return new GetInvoiceOverdueResult(res);
  }
}
