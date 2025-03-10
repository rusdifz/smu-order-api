import { ReadModel } from '@wings-online/common';

export type DeliveryAddressReadModelProps = {
  id: string;
  externalId: string;
  name: string;
  label: string;
  address: string;
};

export type JsonDeliveryAddressProps = {
  id: string;
  external_id: string;
  name: string;
  label: string;
  address: string;
};

export class DeliveryAddressReadModel extends ReadModel {
  constructor(private readonly props: DeliveryAddressReadModelProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  get externalId(): string {
    return this.props.externalId;
  }

  get name(): string {
    return this.props.name;
  }

  get label(): string {
    return this.props.label;
  }

  get address(): string {
    return this.props.address;
  }

  toJSON(): JsonDeliveryAddressProps {
    return {
      id: this.id,
      external_id: this.externalId,
      name: this.name,
      label: this.label,
      address: this.address,
    };
  }
}
