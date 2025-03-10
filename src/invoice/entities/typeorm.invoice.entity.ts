import { DateTime } from 'luxon';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'm_billing_header' })
export class TypeOrmInvoiceEntity {
  @PrimaryColumn()
  readonly id: number;

  @Column({ name: 'invoice_number' })
  readonly number: string;

  @Column()
  readonly total: number;

  @Column({
    transformer: {
      to(value: Date): string {
        return DateTime.fromJSDate(value, { zone: 'Asia/Jakarta' }).toFormat(
          'yyyy-MM-dd',
        );
      },
      from(value: Date): Date {
        return DateTime.fromJSDate(value, {
          zone: 'Asia/Jakarta',
        }).toJSDate();
      },
    },
  })
  readonly dueDate: Date;

  @Column({
    name: 'date_base_line',
    transformer: {
      to(value: Date): string {
        return DateTime.fromJSDate(value, { zone: 'Asia/Jakarta' }).toFormat(
          'yyyy-MM-dd',
        );
      },
      from(value: Date): Date {
        return DateTime.fromJSDate(value, {
          zone: 'Asia/Jakarta',
        }).toJSDate();
      },
    },
  })
  readonly date: Date;

  @Column({ name: 'sls_name' })
  readonly salesName: string;

  @Column({ name: 'j_inv' })
  readonly jackPoint: number;

  @Column({ name: 'q_inv' })
  readonly queenPoint: number;

  @Column({ name: 'k_inv' })
  readonly kingPoint: number;

  @Column({ select: false })
  readonly payer: string;

  @Column({ select: false })
  readonly status: string;
}
