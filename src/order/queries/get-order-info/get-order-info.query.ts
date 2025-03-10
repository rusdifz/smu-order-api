import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class GetOrderInfoQueryProps {
  readonly identity: UserIdentity;
  readonly id: string;
}

export class GetOrderInfoQuery
  extends GetOrderInfoQueryProps
  implements IQuery
{
  constructor(props: GetOrderInfoQueryProps) {
    super();
    Object.assign(this, props);
  }
}
