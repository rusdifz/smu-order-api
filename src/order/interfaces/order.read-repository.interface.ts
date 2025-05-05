import { Collection, PaginatedCollection } from '@wings-corporation/core';
import { UserIdentity } from '@wings-online/common';

import { OrderState } from '../order.constants';
import { OrderReadModel } from '../read-models';
import { ListOrderReadModel } from '../read-models/list-order.read-model';

export type ListProductParams = {
  identity: UserIdentity;
  page?: number;
  pageSize?: number;
  isDelivered?: boolean;
  isHistory?: boolean;
  materialIds?: string[];
  isDummy?: boolean;
};

export interface IOrderReadRepository {
  /**
   * @deprecated use `listOrders` or `listOrderHistories` instead
   * @param params
   */
  listOrder(
    params: ListProductParams,
  ): Promise<PaginatedCollection<OrderReadModel>>;

  getOrderInfo(
    identity: UserIdentity,
    id: string,
    isDummy: boolean,
  ): Promise<OrderReadModel | undefined>;

  getOrderStatusHistory(
    identity: UserIdentity,
    id: string,
    isDummy: boolean,
  ): Promise<OrderReadModel | undefined>;

  // listDeliveredOrders(
  //   identity: UserIdentity,
  //   options?: { limit?: number; cursor?: string },
  // ): Promise<Collection<ListOrderReadModel>>;

  // listUndeliveredOrders(
  //   identity: UserIdentity,
  //   options?: { limit?: number; cursor?: string },
  // ): Promise<Collection<ListOrderReadModel>>;

  listOrderHistories(
    identity: UserIdentity,
    filter?: {
      keyword?: string;
    },
    options?: { limit?: number; cursor?: string },
  ): Promise<Collection<ListOrderReadModel>>;

  listOrders(
    identity: UserIdentity,
    filter?: {
      state?: OrderState;
      // externalIds?: string[];
      keyword?: string;
    },
    options?: { limit?: number; cursor?: string },
  ): Promise<Collection<ListOrderReadModel>>;
  
  listOrderReturn(
    identity: UserIdentity,
    filter?: {
      docNo?: string;
    },
    options?: { limit?: number; page?: number },
  ): Promise<any>;

  listOrderHistoryReturn(
    identity: UserIdentity,
    filter?: {
      docNo?: string;
    },
    options?: { limit?: number; page?: number },
  ): Promise<any>;
}
