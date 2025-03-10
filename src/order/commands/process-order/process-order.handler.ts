import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createBadRequestException } from '@wings-online/common';
import {
  ILegacyOrderService,
  IOrderWriteRepository,
} from '@wings-online/order/interfaces';
import {
  LEGACY_ORDER_SERVICE,
  ORDER_WRITE_REPOSITORY,
} from '@wings-online/order/order.constants';
import { InjectPinoLogger, PinoLogger } from '@wo-sdk/nest-pino-logger';

import { ProcessOrderCommand } from './process-order.command';

@CommandHandler(ProcessOrderCommand)
export class ProcessOrderHandler
  implements ICommandHandler<ProcessOrderCommand, void>
{
  constructor(
    @InjectPinoLogger(ProcessOrderHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORDER_WRITE_REPOSITORY)
    private readonly repository: IOrderWriteRepository,
    @Inject(LEGACY_ORDER_SERVICE)
    private readonly legacyOrderService: ILegacyOrderService,
  ) {}

  async execute(command: ProcessOrderCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const { id, identity } = command;
    const isCustomerDummy = await this.legacyOrderService.isCustomerDummy(
      identity.externalId,
    );

    const order = await this.repository.getById(id, identity, isCustomerDummy);
    if (!order) throw createBadRequestException('order-not-found');

    order.process();

    await this.repository.save(order, isCustomerDummy);

    this.logger.trace(`END`);
  }
}
