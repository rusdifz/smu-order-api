import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  InjectPinoLogger,
  PinoLogger,
} from '@wings-corporation/nest-pino-logger';
import { createBadRequestException } from '@wings-online/common';
import {
  ILegacyOrderService,
  IOrderReadRepository,
} from '@wings-online/order/interfaces';
import {
  DEFAULT_CANCEL_DURATION,
  LEGACY_ORDER_SERVICE,
  ORDER_READ_REPOSITORY,
} from '@wings-online/order/order.constants';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';

import { GetOrderStatusHistoryQuery } from './get-order-status-history.query';
import { GetOrderStatusHistoryResult } from './get-order-status-history.result';

@QueryHandler(GetOrderStatusHistoryQuery)
export class GetOrderStatusHistoryHandler
  implements
    IQueryHandler<GetOrderStatusHistoryQuery, GetOrderStatusHistoryResult>
{
  constructor(
    @InjectPinoLogger(GetOrderStatusHistoryHandler.name)
    readonly logger: PinoLogger,
    @Inject(ORDER_READ_REPOSITORY)
    readonly repository: IOrderReadRepository,
    @Inject(LEGACY_ORDER_SERVICE)
    private readonly legacyOrderService: ILegacyOrderService,
    private readonly parameterService: ParameterService,
  ) {}

  async execute(
    query: GetOrderStatusHistoryQuery,
  ): Promise<GetOrderStatusHistoryResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const { id, identity } = query;

    const isCustomerDummy = await this.legacyOrderService.isCustomerDummy(
      identity.externalId,
    );

    const orders = await this.repository.getOrderStatusHistory(
      identity,
      id,
      isCustomerDummy,
    );

    if (!orders) throw createBadRequestException('order-not-found');

    const cancelDurationParameter = await this.parameterService.getOne(
      ParameterKeys.CANCEL_DURATION,
    );

    const cancelDuration = cancelDurationParameter
      ? Number(cancelDurationParameter.value)
      : DEFAULT_CANCEL_DURATION;

    orders.setCancellationDuration(cancelDuration);

    return new GetOrderStatusHistoryResult(orders);
  }
}
