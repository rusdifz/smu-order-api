import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Nullable } from '@wings-corporation/core';
import { DatetimeTransformer } from '@wings-online/common';

import {
  FlagCancelOrder,
  FlagTriggerCancel,
  OrderStatus,
} from '../order.constants';
import { TypeOrmBillingHeaderEntity } from './typeorm.billing-header.entity';
import { TypeOrmDeliveryHeader } from './typeorm.delivery-header.entity';
import { TypeOrmOrderHeaderDummyEntity } from './typeorm.order-header-dummy.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';
import { TypeOrmOrderHeaderEntity } from './typeorm.order-header.entity';
import { TypeOrmTrackingStatusEntity } from './typeorm.tracking-status.entity';

@Entity({ name: 'order_header_main' })
export class TypeOrmOrderHeaderMainEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly createdAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly deletedAt: Date;

  @Column({ name: 'discount_total' })
  readonly regularDiscountTotal: number;

  @Column({ name: 'dist_chan' })
  readonly distChannels: string;

  @Column({
    name: 'doc_date',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly documentDate: Date;

  @Column({ name: 'doc_number' })
  readonly documentNumber: string;

  @Column({ name: 'invoice_code' })
  readonly invoiceCode: string;

  @Column({ name: 'is_invoice' })
  readonly isInvoice: boolean;

  @Column({ name: 'is_sent' })
  readonly isSent: boolean;

  @Column({ name: 'jack_point' })
  readonly jackPoint: number;

  @Column({ name: 'queen_point' })
  readonly queenPoint: number;

  @Column({ name: 'king_point' })
  readonly kingPoint: number;

  @Column({ name: 'order_by' })
  readonly orderBy: string;

  @Column({ name: 'order_no' })
  readonly orderNo: string;

  @Column({ name: 'sales_order_code' })
  readonly salesOrderCode: string;

  @Column({ name: 'sales_org' })
  readonly salesOrg: string;

  @Column({ name: 'sub_total' })
  readonly subTotal: number;

  @Column({ name: 'total_price' })
  readonly totalPrice: number;

  @Column({ name: 'total_qty' })
  readonly totalQty: number;

  @Column({ name: 'transaction_date' })
  readonly transactionDate: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly updatedAt: Date;

  @Column({ name: 'm_customer_id' })
  readonly mCustomerId: number;

  @Column()
  readonly currency: string;

  @Column({ name: 'doc_type' })
  readonly documentType: string;

  @Column({ name: 'customer_id' })
  readonly customerId: string;

  @Column({ name: 'delivery_method' })
  readonly deliveryMethod: string;

  @Column({ name: 'ship_to' })
  readonly deliveryAddressExternalId: string;

  @Column({ type: 'enum', enum: FlagCancelOrder, nullable: true })
  readonly flagCancelOrder: Nullable<FlagCancelOrder>;

  @Column({
    name: 'delivery_date',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly deliveryDate: Date;

  @Column({ name: 'first_order' })
  readonly firstOrder: string;

  @Column({
    name: 'flag_trigger_cancel',
    type: 'enum',
    nullable: true,
    enum: FlagTriggerCancel,
  })
  readonly flagTriggerCancel: Nullable<FlagTriggerCancel>;

  @Column({ name: 'reward_voucher_id' })
  readonly rewardVoucherId: string;

  @Column({ name: 'mechanic1_id' })
  readonly mechanicId: string;

  @Column({ name: 'coin_total' })
  readonly coinTotal: number;

  @Column({ name: 'coin_mechanic1' })
  readonly coinMechanic1: number;

  @Column({ name: 'cm_mechanic1' })
  readonly creditMemo: number;

  @Column({ name: 'voucher_amount_ge' })
  readonly voucherAmountGe: number;

  @Column({ name: 'voucher_amount_total' })
  readonly voucherDiscountTotal: number;

  @Column({ name: 'voucher_percent_ge' })
  readonly voucherPersentGe: number;

  @Column({ name: 'min_purchase_amount' })
  readonly minPurchaseAmount: number;

  @Column({ name: 'max_discount' })
  readonly maxDiscount: number;

  @Column({ name: 'coin_voucher_ge' })
  readonly coinVoucherGe: number;

  @Column({ name: 'flag_recom' })
  readonly flagRecomendation: string;

  @Column()
  readonly status: OrderStatus;

  @Column()
  readonly longitude: string;

  @Column()
  readonly latitude: string;

  @Column({ name: 'remaining_item_price' })
  readonly remainingItemPrice: number;

  @OneToOne(() => TypeOrmOrderHeaderEntity, (header) => header.main)
  readonly order?: TypeOrmOrderHeaderEntity;

  @OneToOne(() => TypeOrmOrderHeaderHistoryEntity, (history) => history.main)
  readonly history?: TypeOrmOrderHeaderHistoryEntity;

  @OneToOne(() => TypeOrmOrderHeaderDummyEntity, (dummy) => dummy.main)
  readonly dummy?: TypeOrmOrderHeaderDummyEntity;

  @OneToMany(() => TypeOrmDeliveryHeader, (delivery) => delivery.orderMain)
  readonly deliveries?: TypeOrmDeliveryHeader[];

  @OneToOne(() => TypeOrmBillingHeaderEntity, (billing) => billing.orderMain)
  @JoinColumn({ name: 'sales_order_code', referencedColumnName: 'soNumber' })
  readonly billing: TypeOrmBillingHeaderEntity;

  @OneToMany(
    () => TypeOrmTrackingStatusEntity,
    (tracking) => tracking.orderMain,
  )
  readonly trackings?: TypeOrmTrackingStatusEntity[];

  @Column()
  readonly refId: string;
}
