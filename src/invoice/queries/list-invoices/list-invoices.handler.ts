import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IInvoiceReadRepository } from '@wings-online/invoice/interfaces';
import { INVOICE_READ_REPOSITORY } from '@wings-online/invoice/invoice.constants';

import { ListInvoicesQuery } from './list-invoices.query';
import { ListInvoicesResult } from './list-invoices.result';

@QueryHandler(ListInvoicesQuery)
export class ListInvoicesHandler
  implements IQueryHandler<ListInvoicesQuery, ListInvoicesResult>
{
  constructor(
    @InjectPinoLogger(ListInvoicesHandler.name)
    private readonly logger: PinoLogger,
    @Inject(INVOICE_READ_REPOSITORY)
    private readonly repository: IInvoiceReadRepository,
  ) {}

  async execute(query: ListInvoicesQuery): Promise<ListInvoicesResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const { identity, status, cursor, limit } = query;

    const collection = await this.repository.listInvoices(identity, status, {
      cursor,
      limit,
    });
    this.logger.trace(`END`);

    return new ListInvoicesResult(collection);
  }
}
