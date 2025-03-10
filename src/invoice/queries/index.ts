import {
  GetInvoiceDetailController,
  GetInvoiceDetailHandler,
} from './get-invoice-detail';
import {
  GetInvoiceOverdueController,
  GetInvoiceOverdueHandler,
} from './get-invoice-overdue';
import { ListInvoicesController, ListInvoicesHandler } from './list-invoices';

export const QueryControllers = [
  ListInvoicesController,
  GetInvoiceOverdueController,
  GetInvoiceDetailController,
];

export const QueryHandlers = [
  ListInvoicesHandler,
  GetInvoiceOverdueHandler,
  GetInvoiceDetailHandler,
];
