import { DomainEvent } from '@wo-sdk/domain';

export type OrderChangedEventData = {
  id: number;
};

export class OrderChanged extends DomainEvent<OrderChangedEventData> {
  readonly name = 'OrderChanged';
  readonly version = 1;

  constructor(data: OrderChangedEventData) {
    super(data);
  }
}
