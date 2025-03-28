import { DateTime } from 'luxon';

import { Nullable } from '@wings-corporation/core';
import { ReadModel } from '@wings-online/common';

import { OrderStatus } from '../order.constants';

export type TrackingStatusReadModelProps = {
  id: number;
  status: string;
  deliveryNumber: string;
  documentNumber: string;
  redeliveryNumber: Nullable<string>;
  createdAt: Date;
  insertedAt: Date;
};

export type JsonTrackingStatusProps = {
  delivery_number: string | null;
  status: string;
  status_text: string;
  timestamp: number;
};
export class TrackingStatusReadModel extends ReadModel {
  constructor(private readonly props: TrackingStatusReadModelProps) {
    super();
  }

  get deliveryNumber(): string | null {
    return this.props.deliveryNumber;
  }

  get status(): string {
    return this.props.status;
  }

  get statusText(): string {
    return OrderStatus[this.props.status];
  }

  get timestamp(): Date {
    return this.props.createdAt;
  }

  toJSON(): JsonTrackingStatusProps {
    return {
      delivery_number: this.deliveryNumber,
      status: this.status,
      status_text: this.statusText,
      timestamp: DateTime.fromJSDate(this.timestamp).toUnixInteger(),
    };
  }
}
