import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class SuggestSearchOrderQueryDto {
  @JoiSchema(Joi.string().min(1).required())
  readonly search: string;
}
