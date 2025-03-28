import { Collection, PaginatedCollection } from '@wings-corporation/core';
import { UserIdentity } from '@wings-online/common';

import { InvoiceStatus, InvoiceType } from '../invoice.constants';
import {
  InvoiceDetailReadModel,
  InvoiceOverdueReadModel,
  InvoiceReadModel,
} from '../read-models';
import { OverdueInvoiceReadModel } from '../read-models/overdue-invoice.read-model';

/**
 * @deprecated
 */
export type ListInvoiceParams = {
  identity: UserIdentity;
  status: InvoiceType;
  page?: number;
  pageSize?: number;
};

type ListOptions = {
  cursor?: string;
  limit?: number;
};

export interface IInvoiceReadRepository {
  /**
   * @deprecated use `listInvoices` instead
   * @param params
   */
  listInvoice(
    params: ListInvoiceParams,
  ): Promise<PaginatedCollection<InvoiceReadModel>>;
  /**
   * @deprecated use `listOverdueInvoices` instead
   * @param identity
   */
  getInvoiceOverdue(identity: UserIdentity): Promise<InvoiceOverdueReadModel>;
  getInvoiceDetail(
    invoiceNumber: string,
    identity: UserIdentity,
  ): Promise<InvoiceDetailReadModel | undefined>;

  listOverdueInvoices(
    identity: UserIdentity,
  ): Promise<OverdueInvoiceReadModel[]>;
  listInvoices(
    identity: UserIdentity,
    status: InvoiceStatus,
    options?: ListOptions,
  ): Promise<Collection<InvoiceReadModel>>;
}
