import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IEventBus, IIntegrationEvent } from '@wo-sdk/core';
import { EVENT_BUS } from '@wo-sdk/nest-event-bus';
import { InjectPinoLogger, PinoLogger } from '@wo-sdk/nest-pino-logger';

import { OrderChanged } from '../domains/events';

@EventsHandler(OrderChanged)
export class OrderChangedSubscriber implements IEventHandler<OrderChanged> {
  constructor(
    @InjectPinoLogger(OrderChangedSubscriber.name)
    private readonly logger: PinoLogger,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus<IIntegrationEvent>,
  ) {}

  async handle(event: OrderChanged) {
    this.logger.info({ event });

    try {
      const publishResult = await this.eventBus.publish([event]);
      this.logger.info({ publishResult }, `Event published.`);
    } catch (err) {
      this.logger.error({ err }, `Error copying order to order history.`);
    }
  }
}
