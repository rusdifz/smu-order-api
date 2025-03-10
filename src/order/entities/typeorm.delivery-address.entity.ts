import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { DeliveryAddressType } from '../order.constants';
import { TypeOrmOrderHeaderDummyEntity } from './typeorm.order-header-dummy.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';
import { TypeOrmOrderHeaderEntity } from './typeorm.order-header.entity';

@Entity({ schema: 'public', name: 'customer_delivery_address' })
export class TypeOrmDeliveryAddressEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'external_id' })
  readonly externalId: string;

  @Column({ name: 'customer_id' })
  readonly buyerExternalId: string;

  @Column()
  readonly type: DeliveryAddressType;

  @Column()
  readonly label: string;

  @Column()
  readonly name: string;

  @Column()
  readonly address: string;

  @OneToMany(
    () => TypeOrmOrderHeaderEntity,
    (orderHeader) => orderHeader.deliveryAddress,
  )
  readonly orders?: TypeOrmOrderHeaderEntity;

  @OneToMany(
    () => TypeOrmOrderHeaderHistoryEntity,
    (orderHeader) => orderHeader.deliveryAddress,
  )
  readonly orderHistories?: TypeOrmOrderHeaderHistoryEntity;

  @OneToMany(
    () => TypeOrmOrderHeaderDummyEntity,
    (orderHeader) => orderHeader.deliveryAddress,
  )
  readonly orderDummies?: TypeOrmOrderHeaderDummyEntity;
}
