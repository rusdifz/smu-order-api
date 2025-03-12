import { Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';

import { TypeOrmUserInfoEntity } from './typeorm.user-info.entity';

@Entity({ schema: 'public', name: 'm_customer' })
export class TypeOrmUserEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'customer_id' })
  readonly externalId: string;

  @Column({ name: 'is_actived' })
  readonly isActive: boolean;

  @OneToMany(() => TypeOrmUserInfoEntity, (info) => info.user)
  readonly infos: Relation<TypeOrmUserInfoEntity[]>;
}
