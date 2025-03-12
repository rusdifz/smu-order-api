import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import {
  CommandHandlerWithMutex,
  createBadRequestException,
  LockUtil,
} from '@wings-online/common';
import {
  ILegacyOrderService,
  IOrderWriteRepository,
} from '@wings-online/order/interfaces';
import {
  DEFAULT_CANCEL_DURATION,
  LEGACY_ORDER_SERVICE,
  ORDER_WRITE_REPOSITORY,
  OrderStatus,
} from '@wings-online/order/order.constants';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';
import { MutexService } from '@wings-corporation/nest-advisory-lock-mutex';
import { InjectPinoLogger, PinoLogger } from '@wings-corporation/nest-pino-logger';
import { TypeOrmUnitOfWorkService } from '@wings-corporation/nest-typeorm-uow';

import { ChangeOrderCommand } from './change-order.command';
import { ChangeOrderResult } from './change-order.result';

@CommandHandler(ChangeOrderCommand)
export class ChangeOrderHandler extends CommandHandlerWithMutex<
  ChangeOrderCommand,
  ChangeOrderResult
> {
  constructor(
    @InjectPinoLogger(ChangeOrderHandler.name)
    logger: PinoLogger,
    uowService: TypeOrmUnitOfWorkService,
    mutexService: MutexService,
    @Inject(ORDER_WRITE_REPOSITORY)
    private readonly repository: IOrderWriteRepository,
    private readonly eventBus: EventBus,
    @Inject(LEGACY_ORDER_SERVICE)
    private readonly legacyOrderService: ILegacyOrderService,
    private readonly parameterService: ParameterService,
  ) {
    super(mutexService, uowService, { logger });
  }

  async afterCommit(
    command: ChangeOrderCommand,
    result: ChangeOrderResult,
  ): Promise<ChangeOrderResult> {
    const events = result.events.map((event) =>
      event.withCommandMetadata(command),
    );
    await this.eventBus.publishAll(events);
    return result;
  }

  getLockKey(command: ChangeOrderCommand): string {
    return LockUtil.getOrderLockKey(command.data.identity);
  }

  /**
   *
   * @param command
   * @returns
   */
  async handler(command: ChangeOrderCommand): Promise<ChangeOrderResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const { id, identity } = command.data;
    const isCustomerDummy = await this.legacyOrderService.isCustomerDummy(
      identity.externalId,
    );

    if (isCustomerDummy)
      throw createBadRequestException('dummy-account-not-permitted');

    const [order, cancelDurationParameter] = await Promise.all([
      this.repository.getById(id, identity, isCustomerDummy),
      this.parameterService.getOne(ParameterKeys.CANCEL_DURATION),
    ]);
    if (!order) throw createBadRequestException('order-not-found');

    const duration = cancelDurationParameter
      ? Number(cancelDurationParameter.value)
      : DEFAULT_CANCEL_DURATION;

    order.change(duration, false);

    await this.repository.save(order, isCustomerDummy);

    await this.legacyOrderService.changeOrderStatus({
      docNumber: order.documentNumber,
      status: OrderStatus.CANCELLED_BY_CUSTOMER,
    });

    const events = order.flushEvents();
    const result = new ChangeOrderResult(events);

    this.logger.trace(`END`);
    return result;
  }
}
