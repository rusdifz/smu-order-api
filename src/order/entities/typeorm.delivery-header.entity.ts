import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { TypeOrmDeliveryItemEntity } from './typeorm.delivery-item.entity';
import { TypeOrmOrderHeaderDummyEntity } from './typeorm.order-header-dummy.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';
import { TypeOrmOrderHeaderMainEntity } from './typeorm.order-header-main.entity';
import { TypeOrmOrderHeaderEntity } from './typeorm.order-header.entity';

@Entity({ name: 'm_delv_header' })
export class TypeOrmDeliveryHeader {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'deliv_stat' })
  readonly deliveryStatus: string;

  @Column({ name: 'delv_number' })
  readonly deliveryNumber: string;

  @Column({ name: 'invoice_number' })
  readonly invoiceNumber: string;

  @Column({ name: 'pgi_stat' })
  readonly pgiStatus: string;

  @Column({ name: 'pod_date' })
  readonly podDate: Date;

  @Column({ name: 'pod_stat' })
  readonly podStatus: string;

  @Column({ name: 'so_number' })
  readonly soNumber: string;

  @Column({ name: 'coin_amount' })
  readonly coinAmount: number;

  @Column({ name: 'cm_amount' })
  readonly cmAmount: number;

  @Column({ name: 'flag_ws' })
  readonly flagWS: string;

  @OneToMany(() => TypeOrmDeliveryItemEntity, (item) => item.header)
  readonly items?: TypeOrmDeliveryItemEntity[];

  @ManyToOne(() => TypeOrmOrderHeaderEntity, (order) => order.deliveries)
  @JoinColumn({ name: 'so_number', referencedColumnName: 'salesOrderCode' })
  readonly order?: TypeOrmOrderHeaderEntity;

  @ManyToOne(() => TypeOrmOrderHeaderHistoryEntity, (order) => order.deliveries)
  @JoinColumn({ name: 'so_number', referencedColumnName: 'salesOrderCode' })
  readonly orderHistory?: TypeOrmOrderHeaderHistoryEntity;

  @ManyToOne(() => TypeOrmOrderHeaderMainEntity, (order) => order.deliveries)
  @JoinColumn({ name: 'so_number', referencedColumnName: 'salesOrderCode' })
  readonly orderMain?: TypeOrmOrderHeaderMainEntity;

  @ManyToOne(() => TypeOrmOrderHeaderDummyEntity, (order) => order.deliveries)
  @JoinColumn({ name: 'so_number', referencedColumnName: 'salesOrderCode' })
  readonly orderDummy?: TypeOrmOrderHeaderDummyEntity;
}
