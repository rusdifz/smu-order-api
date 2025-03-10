import { Column, Entity, PrimaryColumn } from 'typeorm';

import { TypeOrmBillingInvoiceEntity } from './typeorm.billing-invoice.entity';

@Entity({ name: 'm_billing_promo' })
export class TypeOrmBillingPromoEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column()
  readonly invoiceNumber: number;

  @Column({ name: 'matnr' })
  readonly itemId: number;

  @Column({ name: 'diskon' })
  readonly discount: number;

  readonly invoice?: TypeOrmBillingInvoiceEntity;
}
