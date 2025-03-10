import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmDeliveryHeader } from './typeorm.delivery-header.entity';

@Entity({ name: 'm_delv_item' })
export class TypeOrmDeliveryItemEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'delv_number' })
  readonly deliveryNumber: string;

  @Column({ name: 'matnr' })
  readonly materialId: string;

  @Column({ name: 'matnr_desc' })
  readonly materialDesc: string;

  @Column({ name: 'matnr_title_name' })
  readonly materialTitleName?: string;

  @Column({ name: 'matnr_image' })
  readonly materialImage?: string;

  @Column({ name: 'posnr' })
  readonly posnr: string;

  @Column({ name: 'qty_1' })
  readonly qtyPack: number;

  @Column({ name: 'qty_2' })
  readonly qtyBase: number;

  @Column({ name: 'uom1' })
  readonly uomPack: string;

  @Column({ name: 'uom2' })
  readonly uomBase: string;

  @Column({ name: 'value_delv' })
  readonly valueDelivery: number;

  @Column({ name: 'coin_amount' })
  readonly coinAmount: number;

  @Column({ name: 'flag_ws' })
  readonly flagWS: string;

  @ManyToOne(() => TypeOrmDeliveryHeader, (header) => header.items)
  @JoinColumn({ name: 'delv_number', referencedColumnName: 'deliveryNumber' })
  readonly header?: TypeOrmDeliveryHeader;
}
