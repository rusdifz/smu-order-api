import { DateTime } from 'luxon';

import { LEGACY_ORDER_DEFAULT_TIMEZONE } from '@wings-online/app.constants';
import { ReadModel } from '@wings-online/common';
import { Nullable } from '@wo-sdk/core';

import { FlagCancelOrder, OrderStatus } from '../order.constants';
import { DeliveryAddressReadModel } from './delivery-address.read-model';
import { DeliveryReadModel, JsonDeliveryProps } from './delivery.read-model';
import {
  JsonOrderItemProps,
  OrderItemReadModel,
} from './order-item.read-model';
import { ShippingAddressReadModel } from './shipping-address.read-model';
import { TrackingStatusReadModel } from './tracking-status.read-model';

export type OrderReadModelProps = {
  id: number;
  documentDate: Date;
  transactionDate: Nullable<Date>;
  soNumber: Nullable<string>;
  invoiceCode: Nullable<string>;
  orderNo: string;
  status: OrderStatus;
  subTotal: number;
  totalPrice: number;
  regularDiscountTotal: number;
  voucherDiscountTotal: number;
  maxDiscount?: number;
  bonusCoin: number;
  creditMemo: number;
  remainingItemPrice: number;
  createdAt: Date;
  updatedAt: Nullable<Date>;
  jackPoint?: number;
  queenPoint?: number;
  kingPoint?: number;
  voucherId?: string;
  voucherAmount?: number;
  voucherPercentage?: number;
  orderBy?: string;
  shippingDate?: Date;
  items?: OrderItemReadModel[];
  shippingAddress?: ShippingAddressReadModel;
  shippingAddressWS?: ShippingAddressReadModel;
  deliveryAddress?: DeliveryAddressReadModel;
  deliveries?: DeliveryReadModel[];
  trackings?: TrackingStatusReadModel[];
  flagCancelOrder?: Nullable<string>;
};

export type JsonOrderProps = {
  id: number;
  order_date: number;
  status: string;
  order_number: string;
  undelivered_total_amount: number;
  max_cancelled_at: number;
  bonus: JsonOrderBonusProps;
  order_by: Nullable<string>;
  is_cancellable: boolean;
};

export type JsonOrderDetailProps = Omit<JsonOrderProps, 'bonus'> & {
  updated_at: number;
  sub_total: number;
  items: JsonOrderItemProps[];
  amount: {
    total: number;
    delivered: number;
    remaining: number;
  };
  bonus: JsonOrderDetailBonusProps;
  discount: JsonOrderDiscount;
  shipment: {
    address: string;
    address_name: string;
    date: Nullable<number>;
    deliveries: JsonDeliveryProps[];
  };
};

type JsonOrderBonusProps = {
  point: {
    j: Nullable<number>;
    q: Nullable<number>;
    k: Nullable<number>;
  };
};

type JsonOrderDiscount = {
  regular: number;
  vouchers: JsonOrderDiscountVoucherProps[];
};

type JsonOrderDiscountVoucherProps = {
  name: Nullable<string>;
  amount: Nullable<number>;
  percentage: Nullable<number>;
  max_discount: Nullable<number>;
};

type JsonOrderDetailBonusProps = JsonOrderBonusProps & {
  coin: Nullable<number>;
  credit_memo: Nullable<number>;
};

export class OrderReadModel extends ReadModel {
  cancellationDuration: number;
  constructor(private readonly props: OrderReadModelProps) {
    super();
  }

  get id(): number {
    return this.props.id;
  }

  get orderDate(): Date {
    return this.props.transactionDate || this.props.documentDate;
  }

  get status(): string {
    return OrderStatus[this.props.status];
  }

  get orderNumber(): string {
    return this.props.invoiceCode || this.props.soNumber || this.props.orderNo;
  }

  get undeliveredTotalAmount(): number {
    return this.props.remainingItemPrice;
  }

  get maxCancelledAt(): Date {
    return DateTime.fromJSDate(this.props.createdAt)
      .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
      .plus({ minute: this.cancellationDuration })
      .toJSDate();
  }

  get items(): OrderItemReadModel[] | undefined {
    return this.props.items;
  }

  get coin(): number | null {
    return this.props.bonusCoin;
  }

  get creditMemo(): number | null {
    return this.props.creditMemo;
  }

  get subTotal(): number {
    return this.props.subTotal;
  }

  get total(): number {
    return this.props.totalPrice;
  }

  get remainingItemPrice(): number {
    return this.props.remainingItemPrice;
  }

  get regularDiscountTotal(): number {
    return this.props.regularDiscountTotal;
  }

  get deliveries(): DeliveryReadModel[] | undefined {
    return this.props.deliveries;
  }

  get shippingAddressName(): string | undefined {
    return (
      this.props.shippingAddress?.name || this.props.shippingAddressWS?.name
    );
  }

  get shippingAddress(): string | undefined {
    return (
      this.props.shippingAddress?.address ||
      this.props.shippingAddressWS?.address
    );
  }

  get deliveryAddressName(): string | undefined {
    return this.props.deliveryAddress?.label;
  }

  get deliveryAddress(): string | undefined {
    return this.props.deliveryAddress?.address;
  }

  get trackings(): TrackingStatusReadModel[] | undefined {
    return this.props.trackings;
  }

  get orderBy(): string | null {
    return this.props.orderBy || null;
  }

  get shippingDate(): number | null {
    return this.props.shippingDate
      ? DateTime.fromJSDate(this.props.shippingDate)
          .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
          .toUnixInteger()
      : null;
  }

  get updatedAt(): number {
    return DateTime.fromJSDate(this.props.updatedAt || this.props.createdAt)
      .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
      .toUnixInteger();
  }

  get isCancellable(): boolean {
    return this.props.flagCancelOrder === FlagCancelOrder.QUEUE ? true : false;
  }

  get allVouchers(): JsonOrderDiscountVoucherProps[] {
    const result: JsonOrderDiscountVoucherProps[] = [];
    if (this.props.voucherAmount) {
      result.push({
        name: null,
        amount: this.props.voucherAmount || 0,
        max_discount: this.props.maxDiscount || null,
        percentage: this.props.voucherPercentage || null,
      });
    }

    if (this.props.items) {
      result.push(
        ...this.props.items
          .filter((items) => items.voucherAmount)
          .map((item) => {
            const name = item.voucherBrand || item.itemName;
            return {
              name,
              amount: item.voucherAmount || 0,
              percentage: item.voucherPercentage,
              max_discount: item.maxDiscount,
            };
          }),
      );
    }
    return result;
  }

  public setCancellationDuration(durationInMinute: number) {
    this.cancellationDuration = durationInMinute;
  }

  toJSON(): JsonOrderProps {
    return {
      id: this.id,
      order_date: DateTime.fromJSDate(this.orderDate)
        .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
        .toUnixInteger(),
      status: this.status,
      order_number: this.orderNumber,
      undelivered_total_amount: this.undeliveredTotalAmount,
      is_cancellable: this.isCancellable,
      max_cancelled_at: DateTime.fromJSDate(this.maxCancelledAt)
        .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
        .toUnixInteger(),
      order_by: this.orderBy,
      bonus: {
        point: {
          j: this.props.jackPoint || null,
          q: this.props.queenPoint || null,
          k: this.props.kingPoint || null,
        },
      },
    };
  }

  toJSONDetail(): JsonOrderDetailProps {
    return {
      ...this.toJSON(),
      updated_at: this.updatedAt,
      sub_total: this.subTotal,
      amount: {
        total: this.total,
        remaining: this.remainingItemPrice,
        delivered: this.total - this.remainingItemPrice,
      },
      discount: {
        regular: this.regularDiscountTotal,
        vouchers: this.allVouchers,
      },
      bonus: {
        point: {
          j: this.props.jackPoint || null,
          q: this.props.queenPoint || null,
          k: this.props.kingPoint || null,
        },
        coin: this.coin,
        credit_memo: this.creditMemo,
      },
      items: this.items?.map((item) => item.toJSON()) || [],
      shipment: {
        address: this.deliveryAddress || '',
        address_name: this.deliveryAddressName || '',
        date: this.shippingDate,
        deliveries: this.deliveries?.map((delivery) => delivery.toJSON()) || [],
      },
    };
  }
}
