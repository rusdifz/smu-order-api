import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class ListOrderHistoryQueryProps {
  readonly identity: UserIdentity;
  readonly limit?: number;
  readonly cursor?: string;
  readonly search?: string;
}

export class ListOrderHistoryQuery
  extends ListOrderHistoryQueryProps
  implements IQuery
{
  constructor(props: ListOrderHistoryQueryProps) {
    super();
    Object.assign(this, props);
  }
}
