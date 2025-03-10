import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmMaterialEntity } from './typeorm.material.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';

@Entity({ name: 'order_item_hist' })
export class TypeOrmOrderItemHistoryEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'base_unit' })
  readonly baseUom: string;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'delete_at' })
  readonly deletedAt: Date;

  @Column()
  readonly discount: number;

  @Column({ name: 'doc_number' })
  readonly documentNumber: string;

  @Column({ name: 'material_desc' })
  readonly itemName: string;

  @Column({ name: 'material_id' })
  readonly materialId: string;

  @Column({ name: 'new_material_id' })
  readonly newMaterialId: string;

  @Column()
  readonly price: number;

  @Column({ name: 'price_value' })
  readonly priceValue: number;

  @Column({ name: 'quantity_in_base_unit', type: 'int', nullable: true })
  readonly qtyBase: number | null;

  @Column({ name: 'quantity_in_sales_unit', type: 'int', nullable: true })
  readonly qtyPack: number | null;

  @Column({ name: 'sales_unit' })
  readonly packUom: string;

  @Column({ name: 'sequance' }) // not typo, the current column name is written like this :(
  readonly sequence: string;

  @Column({ name: 'so_number' })
  readonly soNumber: string;

  @Column({ name: 'total_bought' })
  readonly totalBought: number;

  @Column({ name: 'total_sent' })
  readonly totalSent: number;

  @Column({ name: 'type_bought' })
  readonly typeBought: string;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'm_order_header_id' })
  readonly orderHeaderId: number;

  @Column({ name: 'm_material_id' })
  readonly mMaterialId: number;

  @Column({ name: 'material_title_name', type: 'varchar' })
  readonly materialTitleName: string | null;

  @Column({ name: 'material_image', type: 'varchar' })
  readonly materialImage: string | null;

  @Column({ name: 'flashsale_id' })
  readonly flashSaleId: string;

  @Column({ name: 'price_pcs' })
  readonly pricePcs: number;

  @Column({ name: 'discount_pcs' })
  readonly discountPcs: number;

  @Column({ name: 'coin_amount' })
  readonly coinAmount: number;

  @Column({ name: 'coin_pcs' })
  readonly coinPcs: number;

  @Column({ name: 'reward_voucher_id' })
  readonly rewardVoucherId: string;

  @Column({ name: 'voucher_amount' })
  readonly voucherAmount: number;

  @Column({ name: 'voucher_brand', nullable: true, type: 'varchar' })
  readonly voucherBrand: string | null;

  @Column({ name: 'free_product_flag', type: 'varchar' })
  readonly freeProductFlag: string | null;

  @Column({ name: 'voucher_percent' })
  readonly voucherPercent: number;

  @Column({ name: 'min_purchase_amount' })
  readonly minPurchaseAmount: number;

  @Column({ name: 'max_discount' })
  readonly maxDiscount: number;

  @Column({ name: 'coin_voucher' })
  readonly coinVoucher: number;

  @Column({ name: 'flag_recom' })
  readonly flagRecommendation: string;

  @ManyToOne(() => TypeOrmOrderHeaderHistoryEntity, (header) => header.items)
  @JoinColumn({ name: 'm_order_header_id' })
  readonly header?: TypeOrmOrderHeaderHistoryEntity;

  @ManyToOne(
    () => TypeOrmMaterialEntity,
    (material) => material.orderItemHistories,
  )
  @JoinColumn({ name: 'material_id', referencedColumnName: 'materialId' })
  readonly material?: TypeOrmMaterialEntity;
}
