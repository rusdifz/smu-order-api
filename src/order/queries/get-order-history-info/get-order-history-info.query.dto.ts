import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class GetOrderHistoryInfoQueryDto {
  @JoiSchema(joi.string().required())
  readonly id: string;
}
