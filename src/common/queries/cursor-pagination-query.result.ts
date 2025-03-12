import { IQueryResult } from '@nestjs/cqrs';
import { Collection } from '@wings-corporation/core';

import { ReadModel } from '../domains';

interface ICursorPaginationQueryResponseMetadata {
  row_count?: number;
  next_cursor?: string;
}

interface ICursorPaginationQueryResponse {
  metadata: {
    row_count?: number;
    next_cursor?: string;
  };
}

export abstract class CursorPaginationQueryResult<TReadModel extends ReadModel>
  implements ICursorPaginationQueryResponse, IQueryResult
{
  readonly metadata: ICursorPaginationQueryResponseMetadata;
  readonly data: Record<string, any>[];

  constructor(collection: Collection<TReadModel>) {
    const { nextCursor, rowCount } = collection.metadata;

    this.metadata = {
      row_count: rowCount,
      next_cursor: nextCursor,
    };
    this.data = collection.data.map((x) => x.toJSON());
  }
}
