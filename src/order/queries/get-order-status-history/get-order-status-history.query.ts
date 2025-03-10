import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class GetOrderStatusHistoryQueryProps {
  readonly identity: UserIdentity;
  readonly id: string;
}

export class GetOrderStatusHistoryQuery
  extends GetOrderStatusHistoryQueryProps
  implements IQuery
{
  constructor(props: GetOrderStatusHistoryQueryProps) {
    super();
    Object.assign(this, props);
  }
}
