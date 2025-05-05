import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { CursorPaginationQueryDto } from '@wings-corporation/nest-http';

export class ListOrdersReturnTkgQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.number().required())
  readonly page: number;

  @JoiSchema(Joi.number().required())
  readonly limitSFA: number;

  @JoiSchema(Joi.number().required())
  readonly limitWO: number;

  @JoiSchema(Joi.number().required())
  readonly limitWOHist: number;

  @JoiSchema(Joi.string().optional())
  readonly docNo: string;
}
