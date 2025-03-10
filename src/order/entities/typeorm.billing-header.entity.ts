import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmOrderHeaderDummyEntity } from './typeorm.order-header-dummy.entity';
import { TypeOrmOrderHeaderHistoryEntity } from './typeorm.order-header-history.entity';
import { TypeOrmOrderHeaderMainEntity } from './typeorm.order-header-main.entity';
import { TypeOrmOrderHeaderEntity } from './typeorm.order-header.entity';

@Entity({ name: 'm_billing_header' })
export class TypeOrmBillingHeaderEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column()
  readonly soNumber: string;

  @Column({ name: 'invoice_number' })
  readonly number: string;

  @Column()
  readonly subTotal: number;

  @Column({ name: 'discount_value' })
  readonly discount: number;

  @Column()
  readonly total: number;

  @Column()
  readonly dueDate: Date;

  @Column({ name: 'date_base_line' })
  readonly invoiceDate: Date;

  @Column({ name: 'sls_name' })
  readonly salesName: string;

  @Column({ name: 'j_inv' })
  readonly jackPoint: number;

  @Column({ name: 'q_inv' })
  readonly queenPoint: number;

  @Column({ name: 'k_inv' })
  readonly kingPoint: number;

  @Column()
  readonly payer: string;

  @Column()
  readonly status: string;

  @Column({ name: 'flag_ws' })
  readonly flagWs?: string;

  @OneToOne(() => TypeOrmOrderHeaderEntity, (header) => header.billing)
  readonly order: TypeOrmOrderHeaderEntity;

  @OneToOne(() => TypeOrmOrderHeaderMainEntity, (header) => header.billing)
  readonly orderMain: TypeOrmOrderHeaderMainEntity;

  @OneToOne(() => TypeOrmOrderHeaderHistoryEntity, (header) => header.billing)
  readonly orderHistory: TypeOrmOrderHeaderHistoryEntity;

  @OneToOne(() => TypeOrmOrderHeaderDummyEntity, (header) => header.billing)
  readonly orderDummy: TypeOrmOrderHeaderDummyEntity;
}
