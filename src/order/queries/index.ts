import {
  GetOrderHistoryInfoController,
  GetOrderHistoryInfoHandler,
} from './get-order-history-info';
import { GetOrderInfoController, GetOrderInfoHandler } from './get-order-info';
import {
  GetOrderStatusHistoryController,
  GetOrderStatusHistoryHandler,
} from './get-order-status-history/';
import {
  ListOrderHistoryController,
  ListOrderHistoryHandler,
} from './list-order-history';
import { ListOrdersController, ListOrdersHandler } from './list-orders';
import {
  ListOrdersReturnTkgController,
  ListOrdersReturnTkgHandler,
} from './list-orders-return-tkg';
import {
  SuggestSearchOrderController,
  SuggestSearchOrderHandler,
} from './suggest-search-order';

export const QueryControllers = [
  ListOrdersController,
  GetOrderInfoController,
  ListOrderHistoryController,
  GetOrderHistoryInfoController,
  GetOrderStatusHistoryController,
  SuggestSearchOrderController,
  ListOrdersReturnTkgController,
];

export const QueryHandlers = [
  ListOrdersHandler,
  GetOrderInfoHandler,
  ListOrderHistoryHandler,
  GetOrderHistoryInfoHandler,
  GetOrderStatusHistoryHandler,
  SuggestSearchOrderHandler,
  ListOrdersReturnTkgHandler,
];
