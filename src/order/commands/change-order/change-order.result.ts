import { DomainEvent } from '@wings-corporation/domain';

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
