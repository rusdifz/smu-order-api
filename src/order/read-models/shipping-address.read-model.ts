import { ReadModel } from '@wings-online/common';

export type ShippingAddressReadModelProps = {
  id: string;
  name: string;
  address: string;
};

export type JsonShippingAddressProps = {
  id: string;
  name: string;
  address: string;
};

export class ShippingAddressReadModel extends ReadModel {
  constructor(private readonly props: ShippingAddressReadModelProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get address(): string {
    return this.props.address;
  }

  toJSON(): JsonShippingAddressProps {
    return this.props;
  }
}
