import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { CorrelatableRequest } from '@wo-sdk/core';
import { Identity } from '@wo-sdk/nest-http';

import { ChangeOrderBodyDto } from './change-order.body.dto';
import { ChangeOrderCommand } from './change-order.command';

@Controller()
export class ChangeOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Post('change')
  async handler(
    @Request() req: CorrelatableRequest,
    @Identity() identity: UserIdentity,
    @Body() body: ChangeOrderBodyDto,
  ): Promise<any> {
    const cmd = new ChangeOrderCommand({
      ...body,
      identity,
    }).withRequestMetadata(req);
    return this.commandBus.execute(cmd);
  }
}
