import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { TypeOrmBillingHeaderEntity } from './typeorm.billing-header.entity';
import { TypeOrmBillingPromoEntity } from './typeorm.billing-promo.entity';
import { TypeOrmMaterialEntity } from './typeorm.material.entity';

@Entity({ name: 'm_billing_invoice' })
export class TypeOrmBillingInvoiceEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column()
  readonly invoiceNumber: number;

  @Column({ name: 'matnr' })
  readonly itemId: string;

  @Column({ name: 'matnr_desc' })
  readonly name: string;

  @Column({ name: 'qty_2' })
  readonly baseQty: number;

  @Column({ name: 'qty_1' })
  readonly packQty: number;

  @Column({ name: 'uom2' })
  readonly baseUom: string;

  @Column({ name: 'uom1' })
  readonly packUom: string;

  @Column({ name: 'invoice_value' })
  readonly total: number;

  @ManyToOne(() => TypeOrmBillingHeaderEntity, (header) => header.items)
  @JoinColumn({ name: 'invoice_number', referencedColumnName: 'number' })
  readonly header?: TypeOrmBillingHeaderEntity;

  readonly promos?: TypeOrmBillingPromoEntity[];
  readonly item?: TypeOrmMaterialEntity;
}
