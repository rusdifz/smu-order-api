import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { CursorPaginationQueryDto } from '@wings-corporation/nest-http';
import { InvoiceStatus } from '@wings-online/invoice/invoice.constants';

export class ListInvoicesQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.string().valid('PAID', 'UNPAID').required())
  readonly status: InvoiceStatus;
}
