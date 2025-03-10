import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DatetimeTransformer } from '@wings-online/common';
import { Nullable } from '@wo-sdk/core';

import { TypeOrmOrderHeaderDummyEntity } from './typeorm.order-header-dummy.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';
import { TypeOrmOrderHeaderMainEntity } from './typeorm.order-header-main.entity';
import { TypeOrmOrderHeaderEntity } from './typeorm.order-header.entity';

@Entity({ name: 't_tracking_status' })
export class TypeOrmTrackingStatusEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'doc_number' })
  readonly documentNumber: string;

  @Column({ name: 'delivery_number' })
  readonly deliveryNumber: string;

  @Column()
  readonly status: string;

  @Column()
  readonly description: string;

  @Column({ name: 'redelivery_number', type: 'varchar' })
  readonly redeliveryNumber: Nullable<string>;

  @Column({
    name: 'created_date',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly createdDate: Date;

  @Column({
    name: 'insert_date',
    type: 'timestamp',
    transformer: new DatetimeTransformer(),
  })
  readonly insertDate: Date;

  @ManyToOne(() => TypeOrmOrderHeaderEntity, (order) => order.trackings)
  @JoinColumn({ name: 'doc_number', referencedColumnName: 'documentNumber' })
  readonly order?: TypeOrmOrderHeaderEntity;

  @ManyToOne(() => TypeOrmOrderHeaderMainEntity, (order) => order.trackings)
  @JoinColumn({ name: 'doc_number', referencedColumnName: 'documentNumber' })
  readonly orderMain?: TypeOrmOrderHeaderMainEntity;

  @ManyToOne(() => TypeOrmOrderHeaderHistoryEntity, (order) => order.trackings)
  @JoinColumn({ name: 'doc_number', referencedColumnName: 'documentNumber' })
  readonly orderHistory?: TypeOrmOrderHeaderHistoryEntity;

  @ManyToOne(() => TypeOrmOrderHeaderDummyEntity, (order) => order.trackings)
  @JoinColumn({ name: 'doc_number', referencedColumnName: 'documentNumber' })
  readonly orderDummy?: TypeOrmOrderHeaderDummyEntity;
}
