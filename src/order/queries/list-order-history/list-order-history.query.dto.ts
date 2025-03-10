import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

import { CursorPaginationQueryDto } from '@wo-sdk/nest-http';

export class ListOrderHistoryQueryDto extends CursorPaginationQueryDto {
  @JoiSchema(Joi.string().min(1).optional())
  readonly search?: string;
}
