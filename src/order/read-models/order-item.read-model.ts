import { ReadModel } from '@wings-online/common';
import { Nullable } from '@wings-corporation/core';

export type OrderItemReadModelProps = {
  materialId: string;
  newMaterialId: Nullable<string>;
  itemName: string;
  imageUrl: string;
  price: number;
  discount: number;
  discountPcs: number;
  baseQty: Nullable<number>;
  packQty: Nullable<number>;
  baseUom: string;
  packUom: string;
  typeBought: string;
  totalBought: number;
  freeProductFlag: Nullable<string>;
  voucherAmount: Nullable<number>;
  voucherPercentage: Nullable<number>;
  voucherBrand: Nullable<string>;
  maxDiscount: Nullable<number>;
};

export type JsonOrderItemProps = {
  id: Nullable<string>;
  external_id: string;
  name: string;
  image_url: string;
  price: number;
  discount: number;
  discount_base: number;
  is_free: boolean;
  base: JsonOrderItemUomProps;
  pack: JsonOrderItemUomProps;
};

type JsonOrderItemUomProps = {
  uom: string;
  qty: number;
};

export class OrderItemReadModel extends ReadModel {
  constructor(private readonly props: OrderItemReadModelProps) {
    super();
  }

  get materialId(): string {
    return this.props.materialId;
  }

  get newMaterialId(): Nullable<string> {
    return this.props.newMaterialId;
  }

  get itemName(): string {
    return this.props.itemName;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get price(): number {
    return this.props.price;
  }

  get discount(): number {
    return this.props.discount;
  }

  get discountPcs(): number {
    return this.props.discountPcs;
  }

  get baseQty(): Nullable<number> {
    return this.props.baseQty;
  }

  get packQty(): Nullable<number> {
    return this.props.packQty;
  }

  get baseUom(): string {
    return this.props.baseUom;
  }

  get packUom(): string {
    return this.props.packUom;
  }

  get totalBought(): number {
    return this.props.totalBought;
  }

  get typeBought(): string {
    return this.props.typeBought;
  }

  get voucherAmount(): number | null {
    return this.props.voucherAmount;
  }

  get voucherPercentage(): number | null {
    return this.props.voucherPercentage;
  }

  get voucherBrand(): string | null {
    return this.props.voucherBrand;
  }

  get maxDiscount(): number | null {
    return this.props.maxDiscount;
  }

  get isFreeProduct(): boolean {
    return (
      this.price === 0 || this.props.freeProductFlag?.toLowerCase() === 'x'
    );
  }

  toJSON(): JsonOrderItemProps {
    return {
      id: this.newMaterialId,
      name: this.itemName,
      image_url: this.imageUrl,
      external_id: this.materialId,
      price: this.price,
      discount: this.discount,
      discount_base: this.discountPcs,
      is_free: this.isFreeProduct,
      base: {
        uom: this.baseUom,
        qty: this.baseQty || 0,
      },
      pack: {
        uom: this.packUom,
        qty: this.packQty || 0,
      },
    };
  }
}
