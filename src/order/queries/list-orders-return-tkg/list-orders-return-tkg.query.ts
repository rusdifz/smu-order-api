import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class ListOrdersReturnTkgQueryProps {
  readonly identity: UserIdentity;
  readonly docNo?: string;
  readonly page?: number;
  readonly limitSFA?: number;
  readonly limitWO?: number;
  readonly limitWOHist?: number;
}

export class ListOrdersReturnTkgQuery extends ListOrdersReturnTkgQueryProps implements IQuery {
  constructor(props: ListOrdersReturnTkgQueryProps) {
    super();
    Object.assign(this, props);
  }
}
