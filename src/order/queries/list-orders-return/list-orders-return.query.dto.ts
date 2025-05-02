import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { CursorPaginationQueryDto } from '@wings-corporation/nest-http';

export class ListOrdersReturnQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.number().required())
  readonly page: number;

  @JoiSchema(Joi.number().required())
  readonly limit: number;

  @JoiSchema(Joi.string().optional())
  readonly docNo: string;
}
