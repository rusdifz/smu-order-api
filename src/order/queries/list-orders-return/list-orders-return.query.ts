import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class ListOrdersReturnQueryProps {
  readonly identity: UserIdentity;
  readonly docNo?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly sortDocDate?: string;
}

export class ListOrdersReturnQuery extends ListOrdersReturnQueryProps implements IQuery {
  constructor(props: ListOrdersReturnQueryProps) {
    super();
    Object.assign(this, props);
  }
}
