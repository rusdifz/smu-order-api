import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class ProcessOrderBodyDto {
  @JoiSchema(joi.number().integer().required())
  readonly id: number;
}
