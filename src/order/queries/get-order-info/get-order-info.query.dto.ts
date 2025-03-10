import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class GetOrderInfoQueryDto {
  @JoiSchema(joi.string().required())
  readonly id: string;
}
