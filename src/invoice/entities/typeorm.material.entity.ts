import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'material' })
export class TypeOrmMaterialEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'material_id' })
  readonly itemId: string;

  @Column()
  readonly entity: string;

  @Column()
  readonly name: string;

  @Column()
  readonly image: string;
}
