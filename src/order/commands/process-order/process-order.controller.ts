import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { Identity } from '@wo-sdk/nest-http';

import { ProcessOrderBodyDto } from './process-order.body.dto';
import { ProcessOrderCommand } from './process-order.command';

@Controller()
export class ProcessOrderController {
  constructor(private readonly queryBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Post('process')
  async handler(
    @Identity() identity: UserIdentity,
    @Body() body: ProcessOrderBodyDto,
  ): Promise<any> {
    const query = new ProcessOrderCommand({
      identity,
      id: body.id,
    });
    return this.queryBus.execute(query);
  }
}
