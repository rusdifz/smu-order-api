import { CursorPaginationQueryResult } from '@wings-online/common/queries/cursor-pagination-query.result';
import { InvoiceReadModel } from '@wings-online/invoice/read-models';
import { Collection } from '@wo-sdk/core';

export class ListInvoicesResult extends CursorPaginationQueryResult<InvoiceReadModel> {
  constructor(props: Collection<InvoiceReadModel>) {
    super(props);
  }
}
