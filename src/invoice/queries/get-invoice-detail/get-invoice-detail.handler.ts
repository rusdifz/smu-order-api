import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { createBadRequestException } from '@wings-online/common';
import { IInvoiceReadRepository } from '@wings-online/invoice/interfaces';
import { INVOICE_READ_REPOSITORY } from '@wings-online/invoice/invoice.constants';

import { GetInvoiceDetailQuery } from './get-invoice-detail.query';
import { GetInvoiceDetailResult } from './get-invoice-detail.result';

@QueryHandler(GetInvoiceDetailQuery)
export class GetInvoiceDetailHandler
  implements IQueryHandler<GetInvoiceDetailQuery, GetInvoiceDetailResult>
{
  constructor(
    @InjectPinoLogger(GetInvoiceDetailHandler.name)
    private readonly logger: PinoLogger,
    @Inject(INVOICE_READ_REPOSITORY)
    private readonly repository: IInvoiceReadRepository,
  ) {}

  async execute(query: GetInvoiceDetailQuery): Promise<GetInvoiceDetailResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const data = await this.repository.getInvoiceDetail(
      query.invoiceNumber,
      query.identity,
    );

    if (!data) throw createBadRequestException('invoice not found');

    this.logger.trace(`END`);

    return new GetInvoiceDetailResult(data);
  }
}
