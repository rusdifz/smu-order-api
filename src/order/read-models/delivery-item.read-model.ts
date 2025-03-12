import { ReadModel } from '@wings-online/common';
import { Nullable } from '@wings-corporation/core';

export type DeliveryItemReadModelProps = {
  id: number;
  externalId: number;
  name: string;
  imageUrl: string;
  price: number;
  baseQty: Nullable<number>;
  packQty: Nullable<number>;
};

export type JsonDeliveryItemProps = {
  id: number;
  external_id: number;
  name: string;
  image_url: string;
  price: number;
  base_qty: Nullable<number>;
  pack_qty: Nullable<number>;
};

export class DeliveryItemReadModel extends ReadModel {
  constructor(private readonly props: DeliveryItemReadModelProps) {
    super();
  }

  toJSON(): JsonDeliveryItemProps {
    return {
      id: this.props.id,
      external_id: this.props.externalId,
      name: this.props.name,
      image_url: this.props.imageUrl,
      price: this.props.price,
      base_qty: this.props.baseQty,
      pack_qty: this.props.packQty,
    };
  }
}
