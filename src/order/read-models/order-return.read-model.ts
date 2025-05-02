import { ReadModel } from '@wings-online/common';


export type OrderReturnHeaderProps = {
  status: string;
  docNumber: string;
  date: string;
  reason: string;
  items: OrderReturnDetailProps[];
}

export type OrderReturnDetailProps = {
  order_type_id: string;
  doc_code: string;
  doc_no: string;
  item: number;
  material_id: string;
  material_desc: string;
  qty_case: number;
  sls_unit: string;
  qty_pack: number;
  base_unit: string;
  net_price: number;
  gross_price: number;
  disc_price: number;
  promo_no: string;
  promo_type: string;
  level: string;
  high_level: string;
  min_amount: number;
  price_rate: number;
  cond_price: number;
  cond_unit: string;
  reason_id: string;
  prod_hier1: string;
  kode_plu: string;
  refund_type: string;
};


export class OrderReturnReadModel extends ReadModel {
  constructor(private readonly props: OrderReturnHeaderProps) {
    super();
  }

  get status(): string {
    return this.props.status;
  }

  get docNumber(): string {
    return this.props.docNumber;
  }

  get date(): string {
    return this.props.date;
  }

  get reason(): string {
    return this.props.reason;
  }

  get items(): OrderReturnDetailProps[] {
    return this.props.items;
  }

  toJSON(): Record<string, any> {
    throw new Error('Method not implemented.');
  }
}
