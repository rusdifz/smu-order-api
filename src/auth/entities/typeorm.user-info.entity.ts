import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';

import { TypeOrmUserEntity } from './typeorm.user.entity';

@Entity({ schema: 'public', name: 'customer_info' })
export class TypeOrmUserInfoEntity {
  @PrimaryColumn({ name: 'customer_id', select: false })
  readonly userId: string;

  @Column()
  readonly type: string;

  @Column()
  readonly payerId: string;

  @ManyToOne(() => TypeOrmUserEntity, (user) => user.infos)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'externalId' })
  readonly user: Relation<TypeOrmUserEntity>;
}
