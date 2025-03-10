import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';

import { TypeOrmCustomerEntity } from './typeorm.customer.entity';

@Entity({ schema: 'public', name: 'customer_info' })
export class TypeOrmCustomerInfoEntity {
  @PrimaryColumn({ name: 'customer_id' })
  readonly customerId: string;

  @Column()
  readonly type: string;

  @Column()
  readonly group: number;

  @Column({ name: 'sales_org' })
  readonly salesOrg: string;

  @Column({ name: 'dist_channel' })
  readonly distChannels: string;

  @Column({ name: 'sales_office' })
  readonly salesOffice: string;

  @Column()
  readonly term: string;

  @Column()
  readonly payerId: string;

  @OneToOne(() => TypeOrmCustomerEntity, (customer) => customer.infos)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'externalId' })
  readonly customer: Relation<TypeOrmCustomerEntity>;
}
