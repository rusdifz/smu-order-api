import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { CursorPaginationQueryDto } from '@wings-corporation/nest-http';

export class ListOrdersQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.string().min(1).optional())
  readonly search?: string;

  @JoiSchema(Joi.boolean().optional())
  readonly is_delivered?: boolean;
}
