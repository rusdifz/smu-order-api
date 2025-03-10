import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmOrderEntity } from './typeorm.order.entity';

@Entity({ name: 'm_billing_header' })
export class TypeOrmBillEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column()
  readonly soNumber: string;

  @Column()
  readonly status: string;

  @Column({ name: 'flag_ws' })
  readonly flagWs?: string;

  @OneToOne(() => TypeOrmOrderEntity, (header) => header.bill)
  readonly order?: TypeOrmOrderEntity;
}
