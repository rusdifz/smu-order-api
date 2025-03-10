import { DateTime } from 'luxon';

import { ReadModel } from '@wings-online/common';
import { Nullable } from '@wo-sdk/core';

export type InvoiceReadModelProps = {
  id: number;
  number: string;
  total: number;
  dueDate: Date;
  invoiceDate: Date;
  salesName: string;
  jackPoint?: number;
  queenPoint?: number;
  kingPoint?: number;
};

export type JsonInvoiceProps = {
  id: string;
  number: string;
  total: number;
  due_date: number;
  invoice_date: number;
  sales_name: string;
  point: {
    j: Nullable<number>;
    q: Nullable<number>;
    k: Nullable<number>;
  };
};

export class InvoiceReadModel extends ReadModel {
  constructor(private readonly props: InvoiceReadModelProps) {
    super();
  }

  toJSON(): JsonInvoiceProps {
    return {
      id: this.props.id.toString(),
      number: this.props.number,
      total: this.props.total,
      due_date: DateTime.fromJSDate(this.props.dueDate).toUnixInteger(),
      invoice_date: DateTime.fromJSDate(this.props.invoiceDate).toUnixInteger(),
      sales_name: this.props.salesName,
      point: {
        j: this.props.jackPoint ?? null,
        q: this.props.queenPoint ?? null,
        k: this.props.kingPoint ?? null,
      },
    };
  }
}
