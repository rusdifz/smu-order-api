import { DateTime } from 'luxon';

import { createBadRequestException } from '@wings-online/common';
import { Nullable } from '@wo-sdk/core';
import { AggregateRoot, EntityId } from '@wo-sdk/domain';

import {
  FlagCancelOrder,
  FlagTriggerCancel,
  OrderStatus,
} from '../order.constants';
import { OrderChanged } from './events';

export type OrderRequiredProps = {
  id: number;
  flagCancelOrder: Nullable<FlagCancelOrder>;
  flagTriggerCancel: Nullable<FlagTriggerCancel>;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  documentNumber: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type OrderOptionalProps = Partial<{}>;

export type OrderProps = OrderRequiredProps & OrderOptionalProps;

export class OrderAggregate extends AggregateRoot<
  Required<OrderProps>,
  number
> {
  private constructor(
    props: OrderRequiredProps & OrderOptionalProps,
    id?: number,
  ) {
    super(props, id ? EntityId.fromNumber(id) : undefined);
  }

  public static create(props: OrderRequiredProps) {
    return new OrderAggregate(props, undefined);
  }

  public static reconstitute(props: OrderProps, id: number) {
    return new OrderAggregate(props, id);
  }

  get flagCancelOrder(): Nullable<FlagCancelOrder> {
    return this.props.flagCancelOrder;
  }

  get flagTriggerCancel(): Nullable<FlagTriggerCancel> {
    return this.props.flagTriggerCancel;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date {
    return this.props.deletedAt;
  }

  get documentNumber(): string {
    return this.props.documentNumber;
  }

  private validateStatusAndTime(minute: number): void {
    const current = DateTime.fromJSDate(new Date()).toUnixInteger();
    const created = DateTime.fromJSDate(this.props.createdAt)
      .plus({ minutes: minute })
      .toUnixInteger();

    if (this.props.flagCancelOrder !== FlagCancelOrder.QUEUE) {
      throw createBadRequestException('order-is-not-in-queue');
    }

    if (current > created) {
      throw createBadRequestException('order-is-expired');
    }
  }

  private delete(isBySystem?: boolean) {
    this.props.flagCancelOrder = null;
    this.props.flagTriggerCancel = isBySystem
      ? FlagTriggerCancel.SYSTEM_CANCEL
      : FlagTriggerCancel.CANCEL;
    this.props.status = OrderStatus.CANCELLED_BY_CUSTOMER;
    this.props.updatedAt = new Date();
    this.props.deletedAt = new Date();
  }

  change(minute: number, isBySystem?: boolean) {
    this.validateStatusAndTime(minute);
    this.delete(isBySystem);
    this.markDirty();

    this.raise(new OrderChanged({ id: this.props.id }));
  }

  process() {
    if (this.props.status === OrderStatus.PROCESSING) {
      throw createBadRequestException('order-is-processing');
    } else if (this.props.flagCancelOrder !== FlagCancelOrder.QUEUE) {
      throw createBadRequestException('order-is-not-in-queue');
    }

    this.props.flagCancelOrder = FlagCancelOrder.RECALL;
    this.props.updatedAt = new Date();
    this.markDirty();
  }
}
