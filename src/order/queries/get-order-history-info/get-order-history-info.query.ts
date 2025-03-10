import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class GetOrderHistoryInfoQueryProps {
  readonly identity: UserIdentity;
  readonly id: string;
}

export class GetOrderHistoryInfoQuery
  extends GetOrderHistoryInfoQueryProps
  implements IQuery
{
  constructor(props: GetOrderHistoryInfoQueryProps) {
    super();
    Object.assign(this, props);
  }
}
