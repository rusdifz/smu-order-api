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

import { FlagCancelOrder, OrderStatus } from '../order.constants';
import { TypeOrmBillEntity } from './typeorm.bill.entity';
import { TypeOrmDeliveryEntity } from './typeorm.delivery.entity';
import { TypeOrmOrderItemEntity } from './typeorm.order-item.entity';

@Entity({ name: 'order_header_main' })
export class TypeOrmOrderEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({
    name: 'doc_date',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly documentDate: Date;

  @Column({ name: 'doc_number' })
  readonly documentNumber: string;

  @Column({ name: 'doc_type' })
  readonly docType: string;

  @Column({
    name: 'transaction_date',
  })
  readonly transactionDate?: Date;

  @Column({ name: 'sales_order_code', select: false })
  readonly salesOrderCode: string;

  @Column()
  readonly customerId: string;

  @Column()
  readonly status: OrderStatus;

  @Column({ name: 'jack_point' })
  readonly jackPoint: number;

  @Column({ name: 'queen_point' })
  readonly queenPoint: number;

  @Column({ name: 'king_point' })
  readonly kingPoint: number;

  @Column({ name: 'order_by' })
  readonly orderBy: string;

  @Column({ type: 'enum', enum: FlagCancelOrder, nullable: true })
  readonly flagCancelOrder: Nullable<FlagCancelOrder>;

  @Column({ name: 'remaining_item_price', nullable: true })
  readonly remainingItemPrice?: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly createdAt: Date;

  @Column({
    name: 'deleted_at',
    select: false,
  })
  readonly deletedAt: Date;

  @OneToMany(() => TypeOrmDeliveryEntity, (delivery) => delivery.order)
  @JoinColumn({ name: 'sales_order_code', referencedColumnName: 'soNumber' })
  readonly deliveries?: TypeOrmDeliveryEntity[];

  @OneToOne(() => TypeOrmBillEntity, (bill) => bill.order)
  @JoinColumn({ name: 'sales_order_code', referencedColumnName: 'soNumber' })
  readonly bill?: TypeOrmDeliveryEntity;

  @OneToMany(() => TypeOrmOrderItemEntity, (item) => item.order)
  readonly items?: TypeOrmOrderItemEntity[];
}
