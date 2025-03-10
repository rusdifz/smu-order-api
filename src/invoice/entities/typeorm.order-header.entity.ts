import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmBillingHeaderEntity } from './typeorm.billing-header.entity';

@Entity({ name: 'order_header' })
export class TypeOrmOrderHeaderEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'sales_order_code' })
  readonly salesOrderCode: string;

  @Column({ name: 'customer_id' })
  readonly customerId: string;

  @OneToOne(() => TypeOrmBillingHeaderEntity, (billing) => billing.orderHeader)
  @JoinColumn({ name: 'sales_order_code', referencedColumnName: 'soNumber' })
  readonly billing: TypeOrmBillingHeaderEntity;
}
