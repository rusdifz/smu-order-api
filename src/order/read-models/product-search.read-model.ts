import { Nullable } from '@wings-corporation/core';

export interface ProductSearchReadModel {
  id: string;
  external_id: string;
  name: string;
  image: string;
  category_id: Nullable<number>;
}

export interface SuggestProductSearchReadModel {
  is_same: boolean;
  old_search: string;
  suggested_search: string;
}
