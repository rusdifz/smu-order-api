import { Collection } from '@wings-corporation/core';
import { CursorPaginationQueryResult } from '@wings-online/common/queries/cursor-pagination-query.result';
import { ListOrderReadModel } from '@wings-online/order/read-models/list-order.read-model';

export class ListOrderHistoryResult extends CursorPaginationQueryResult<ListOrderReadModel> {
  constructor(collection: Collection<ListOrderReadModel>) {
    super(collection);
  }
}
