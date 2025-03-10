import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class ListOrdersQueryProps {
  readonly identity: UserIdentity;
  readonly limit?: number;
  readonly cursor?: string;
  readonly search?: string;
  readonly isDelivered?: boolean;
}

export class ListOrdersQuery extends ListOrdersQueryProps implements IQuery {
  constructor(props: ListOrdersQueryProps) {
    super();
    Object.assign(this, props);
  }
}
