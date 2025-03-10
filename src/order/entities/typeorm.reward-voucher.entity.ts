import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'm_reward_voucher' })
export class TypeOrmRewardVoucherEntity {
  @PrimaryColumn({ name: 'reward_voucher_id' })
  readonly id: string;

  readonly type: string;

  @Column({ name: 'is_general' })
  readonly isGeneral: number;

  @Column({ name: 'discount_type' })
  readonly discountType: string;

  @Column()
  readonly amount: number;

  @Column({ name: 'min_purchase_amount' })
  readonly minPurchaseAmount: number;

  @Column({ name: 'min_purchase_qty' })
  readonly minPurchaseQty: number;

  @Column({ name: 'min_purchase_uom' })
  readonly minPurchaseUom: number;

  @Column({ name: 'max_discount' })
  readonly maxDiscount: number;

  @Column({ name: 'expired_in' })
  readonly expiredIn: number;

  @Column()
  readonly qty: number;

  @Column()
  readonly uom: string;

  @Column({ name: 'direct_page' })
  readonly directPage: string;

  @Column()
  readonly tnc: string;

  @Column()
  readonly status: string;

  @Column({ name: 'created_date' })
  readonly createdAt: Date;

  @Column({ name: 'updated_date' })
  readonly updatedAt: Date;

  @Column({ name: 'is_upload_customer' })
  readonly isUploadCustomer: number;

  @Column({ name: 'mg2_get_mid' })
  readonly mg2GetMid: string;

  @Column({ name: 'upload_customer_file' })
  readonly uploadCustomerFile: string;

  @Column({ name: 'origin_material_id' })
  readonly originMaterialId: string;

  @Column({ name: 'origin_material_title_name' })
  readonly originMaterialTitleName: string;
}
