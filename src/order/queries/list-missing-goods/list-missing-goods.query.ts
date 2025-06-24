import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class ListMissingGoodsQueryProps {
  readonly identity: UserIdentity;
  readonly docNo?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly sortDocDate?: string;
  readonly status?: string;
}

export class ListMissingGoodsQuery
  extends ListMissingGoodsQueryProps
  implements IQuery
{
  constructor(props: ListMissingGoodsQueryProps) {
    super();
    Object.assign(this, props);
  }
}
