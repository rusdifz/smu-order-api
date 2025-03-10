import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';
import { InvoiceStatus } from '@wings-online/invoice/invoice.constants';

export class ListInvoicesQueryProps {
  readonly identity: UserIdentity;
  readonly status: InvoiceStatus;
  readonly cursor?: string;
  readonly limit?: number;
}

export class ListInvoicesQuery
  extends ListInvoicesQueryProps
  implements IQuery
{
  constructor(props: ListInvoicesQueryProps) {
    super();
    Object.assign(this, props);
  }
}
