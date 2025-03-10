import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';

import { TypeOrmCustomerInfoEntity } from './typeorm.customer-info.entity';
import { TypeOrmCustomerShippingAddress } from './typeorm.customer-shipping-address.entity';

@Entity({ schema: 'public', name: 'm_customer' })
export class TypeOrmCustomerEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'customer_id' })
  readonly externalId: string;

  @Column({ name: 'is_actived' })
  readonly isActive: boolean;

  @OneToMany(() => TypeOrmCustomerInfoEntity, (info) => info.customer)
  readonly infos: Relation<TypeOrmCustomerInfoEntity[]>;

  @OneToMany(
    () => TypeOrmCustomerShippingAddress,
    (shippingAddress) => shippingAddress.customer,
  )
  readonly shippingAddresses?: TypeOrmCustomerShippingAddress[];
}
