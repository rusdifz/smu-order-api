import { DateTime } from 'luxon';

import { LEGACY_ORDER_DEFAULT_TIMEZONE } from '@wings-online/app.constants';
import { ReadModel } from '@wings-online/common';
import { Nullable } from '@wo-sdk/core';

import {
  DEFAULT_CANCEL_DURATION,
  FlagCancelOrder,
  OrderStatus,
} from '../order.constants';

export type ListOrderReadModelJsonProps = {
  id: number;
  order_date: number;
  order_number: string;
  undelivered_total_amount: Nullable<number>;
  order_by: string;
  is_cancellable: boolean;
  max_cancelled_at: Nullable<number>;
  bonus: {
    point: {
      j?: number;
      q?: number;
      k?: number;
    };
  };
  status: string;
};

type ListOrderReadModelProps = {
  id: number;
  documentDate: Date;
  documentNumber: string;
  transactionDate?: Date;
  orderBy: string;
  jackPoint?: number;
  queenPoint?: number;
  kingPoint?: number;
  status: OrderStatus;
  flagCancelOrder: Nullable<FlagCancelOrder>;
  remainingItemPrice: Nullable<number>;
  createdAt: Date;
};

export class ListOrderReadModel extends ReadModel {
  private MAX_CANCEL_DURATION = DEFAULT_CANCEL_DURATION;

  constructor(readonly props: ListOrderReadModelProps) {
    super();
  }

  set maxCancelDuration(duration: number) {
    this.MAX_CANCEL_DURATION = duration;
  }

  get maxCancelDuration() {
    return this.MAX_CANCEL_DURATION;
  }

  get orderDate() {
    return this.props.transactionDate || this.props.documentDate;
  }

  get isCancellable() {
    return this.props.flagCancelOrder === FlagCancelOrder.QUEUE ? true : false;
  }

  get maxCancelTime() {
    return DateTime.fromJSDate(this.props.createdAt, {
      zone: LEGACY_ORDER_DEFAULT_TIMEZONE,
    })
      .plus({
        minutes: this.maxCancelDuration,
      })
      .toJSDate();
  }

  toJSON(): ListOrderReadModelJsonProps {
    return {
      id: this.props.id,
      order_date: DateTime.fromJSDate(this.orderDate, {
        zone: LEGACY_ORDER_DEFAULT_TIMEZONE,
      }).toUnixInteger(),
      order_number: this.props.documentNumber,
      status: OrderStatus[this.props.status],
      undelivered_total_amount: this.props.remainingItemPrice,
      order_by: this.props.orderBy,
      is_cancellable: this.isCancellable,
      max_cancelled_at: this.maxCancelTime
        ? DateTime.fromJSDate(this.maxCancelTime).toUnixInteger()
        : null,
      bonus: {
        point: {
          j: this.props.jackPoint,
          q: this.props.queenPoint,
          k: this.props.kingPoint,
        },
      },
    };
  }
}
