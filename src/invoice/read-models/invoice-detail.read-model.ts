import { DateTime } from 'luxon';

import { ReadModel } from '@wings-online/common';
import { Nullable } from '@wo-sdk/core';

export type InvoiceDetailReadModelProps = {
  invoiceNumber: string;
  soNumber: string;
  dueDate: Date;
  subtotal: number;
  discount: number;
  total: number;
  jackPoint?: number;
  queenPoint?: number;
  kingPoint?: number;
  items: Array<{
    imageUrl: string;
    name: string;
    baseQty: number;
    baseUom: string;
    packQty: number;
    packUom: string;
    total: number;
    discount: number;
  }>;
};

export type JsonInvoiceDetailProps = {
  invoice_number: string;
  so_number: string;
  due_date: number;
  subtotal: number;
  discount: number;
  total: number;
  point: {
    j: Nullable<number>;
    q: Nullable<number>;
    k: Nullable<number>;
  };
  items: Array<{
    image_url: string;
    name: string;
    base_qty: Nullable<number>;
    base_uom: Nullable<string>;
    pack_qty: Nullable<number>;
    pack_uom: Nullable<string>;
    total: number;
    discount: number;
  }>;
};

export class InvoiceDetailReadModel extends ReadModel {
  constructor(private readonly props: InvoiceDetailReadModelProps) {
    super();
  }

  toJSON(): JsonInvoiceDetailProps {
    return {
      invoice_number: this.props.invoiceNumber,
      so_number: this.props.soNumber,
      due_date: DateTime.fromJSDate(this.props.dueDate).toUnixInteger(),
      subtotal: this.props.subtotal,
      discount: this.props.discount,
      total: this.props.total,
      point: {
        j: this.props.jackPoint ?? null,
        q: this.props.queenPoint ?? null,
        k: this.props.kingPoint ?? null,
      },
      items: this.props.items.map((item) => ({
        image_url: item.imageUrl,
        name: item.name,
        base_qty: item.baseQty || null,
        base_uom: item.baseUom || null,
        pack_qty: item.packQty || null,
        pack_uom: item.packUom || null,
        total: item.total,
        discount: item.discount,
      })),
    };
  }
}
