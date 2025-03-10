import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmOrderEntity } from './typeorm.order.entity';

@Entity({ name: 'm_delv_header' })
export class TypeOrmDeliveryEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'so_number' })
  readonly soNumber: string;

  @ManyToOne(() => TypeOrmOrderEntity, (order) => order.deliveries)
  @JoinColumn({ name: 'so_number', referencedColumnName: 'salesOrderCode' })
  readonly order?: TypeOrmOrderEntity;
}
