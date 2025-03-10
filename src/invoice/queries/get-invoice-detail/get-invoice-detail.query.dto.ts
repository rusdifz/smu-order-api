import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class GetInvoiceDetailQueryDto {
  @JoiSchema(Joi.string().required())
  readonly invoice_number: string;
}
