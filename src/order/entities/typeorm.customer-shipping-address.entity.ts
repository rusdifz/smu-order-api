import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { TypeOrmCustomerEntity } from './typeorm.customer.entity';
import { TypeOrmOrderHeaderDummyEntity } from './typeorm.order-header-dummy.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';
import { TypeOrmOrderHeaderEntity } from './typeorm.order-header.entity';

@Entity({ name: 'm_cust_shipto' })
export class TypeOrmCustomerShippingAddress {
  @PrimaryColumn({ name: 'shipto_id' })
  readonly id: string;

  @Column({ name: 'cust_id' })
  readonly customerId: string;

  @Column({ name: 'shipto_name' })
  readonly name: string;

  @Column({ name: 'shipto_address' })
  readonly address: string;

  @ManyToOne(
    () => TypeOrmCustomerEntity,
    (customer) => customer.shippingAddresses,
  )
  @JoinColumn({ name: 'cust_id', referencedColumnName: 'externalId' })
  readonly customer?: TypeOrmCustomerEntity;

  @OneToMany(
    () => TypeOrmOrderHeaderEntity,
    (orderHeader) => orderHeader.shippingAddress,
  )
  readonly orders?: TypeOrmOrderHeaderEntity;

  @OneToMany(
    () => TypeOrmOrderHeaderHistoryEntity,
    (orderHeader) => orderHeader.shippingAddress,
  )
  readonly orderHistories?: TypeOrmOrderHeaderHistoryEntity;

  @OneToMany(
    () => TypeOrmOrderHeaderDummyEntity,
    (orderHeader) => orderHeader.shippingAddress,
  )
  readonly orderDummies?: TypeOrmOrderHeaderDummyEntity;
}
