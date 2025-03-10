import { DomainEvent } from '@wo-sdk/domain';

export class ChangeOrderResult {
  readonly events: DomainEvent<any>[];

  constructor(events: DomainEvent<any>[]) {
    this.events = events;
  }

  toJSON() {
    return {
      data: undefined,
    };
  }
}
