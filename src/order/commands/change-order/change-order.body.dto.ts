import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class ChangeOrderBodyDto {
  @JoiSchema(joi.number().integer().positive().required())
  readonly id: number;
}
