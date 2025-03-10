import { ReadModel } from '@wings-online/common';

import {
  DeliveryItemReadModel,
  JsonDeliveryItemProps,
} from './delivery-item.read-model';

export type DeliveryReadModelProps = {
  id: number;
  status: string;
  number: string;
  soNumber: string;
  items: DeliveryItemReadModel[];
};

export type JsonDeliveryProps = {
  sp_number: string;
  status: string;
  products: JsonDeliveryItemProps[];
};

export class DeliveryReadModel extends ReadModel {
  constructor(private readonly props: DeliveryReadModelProps) {
    super();
  }

  toJSON(): JsonDeliveryProps {
    return {
      sp_number: this.props.number,
      status: this.props.status,
      products: this.props.items.map((item) => item.toJSON()),
    };
  }
}
