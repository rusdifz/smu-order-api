import { ChangeOrderController, ChangeOrderHandler } from './change-order';
import { ProcessOrderController, ProcessOrderHandler } from './process-order';

export const CommandHandlers = [ChangeOrderHandler, ProcessOrderHandler];

export const CommandControllers = [
  ChangeOrderController,
  ProcessOrderController,
];
