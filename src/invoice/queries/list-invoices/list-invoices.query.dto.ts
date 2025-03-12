import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { InvoiceStatus } from '@wings-online/invoice/invoice.constants';
import { CursorPaginationQueryDto } from '@wings-corporation/nest-http';

export class ListInvoicesQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.string().valid('PAID', 'UNPAID').required())
  readonly status: InvoiceStatus;
}
