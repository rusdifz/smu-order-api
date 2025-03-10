import { BaseReadModelMapper } from '@wings-online/common';

import { InvoiceReadModel } from '../read-models';

export interface IInvoice {
  id: number;
  number: string;
  invoiceDate: Date;
  total: number;
  dueDate: Date;
  salesName: string;
  jackPoint: number;
  queenPoint: number;
  kingPoint: number;
}

export class InvoiceMapper extends BaseReadModelMapper<
  IInvoice,
  InvoiceReadModel
> {
  toReadModel(data: IInvoice): InvoiceReadModel {
    return new InvoiceReadModel({
      id: data.id,
      number: data.number,
      total: data.total,
      dueDate: data.dueDate,
      invoiceDate: data.invoiceDate,
      salesName: data.salesName,
      jackPoint: data.jackPoint,
      queenPoint: data.queenPoint,
      kingPoint: data.kingPoint,
    });
  }
}
