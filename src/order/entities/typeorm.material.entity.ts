import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { TypeOrmOrderItemDummyEntity } from './typeorm.order-item-dummy.entity';
import { TypeOrmOrderItemHistoryEntity } from './typeorm.order-item-history.entity';
import { TypeOrmOrderItemEntity } from './typeorm.order-item.entity';

@Entity({ name: 'm_material' })
export class TypeOrmMaterialEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'material_id' })
  readonly materialId: string;

  @Column({ name: 'material_title_name' })
  readonly titleName: string;

  @Column()
  readonly image: string;

  @OneToMany(() => TypeOrmOrderItemEntity, (orderItem) => orderItem.material)
  readonly orderItems?: TypeOrmOrderItemEntity[];

  @OneToMany(
    () => TypeOrmOrderItemHistoryEntity,
    (orderItemHistory) => orderItemHistory.material,
  )
  readonly orderItemHistories?: TypeOrmOrderItemHistoryEntity[];

  @OneToMany(
    () => TypeOrmOrderItemDummyEntity,
    (orderItemDummy) => orderItemDummy.material,
  )
  readonly orderItemDummies?: TypeOrmOrderItemHistoryEntity[];
}
