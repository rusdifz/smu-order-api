import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { CursorPaginationQueryDto } from '@wings-corporation/nest-http';

export class ListOrdersReturnTkgQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.string().optional())
  readonly docNo?: string;
}
