import { IQuery } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class GetInvoiceDetailQueryProps {
  readonly identity: UserIdentity;
  readonly invoiceNumber: string;
}

export class GetInvoiceDetailQuery
  extends GetInvoiceDetailQueryProps
  implements IQuery
{
  constructor(props: GetInvoiceDetailQueryProps) {
    super();
    Object.assign(this, props);
  }
}
