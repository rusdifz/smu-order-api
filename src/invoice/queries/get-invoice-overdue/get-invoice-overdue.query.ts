import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class GetInvoiceOverdueQueryProps {
  readonly identity: UserIdentity;
}

export class GetInvoiceOverdueQuery
  extends GetInvoiceOverdueQueryProps
  implements IQuery
{
  constructor(props: GetInvoiceOverdueQueryProps) {
    super();
    Object.assign(this, props);
  }
}
