import { DateTime } from 'luxon';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'm_billing_header' })
export class TypeOrmOverdueInvoiceEntity {
  @PrimaryColumn()
  readonly id: number;

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

  @Column()
  readonly payer: string;

  @Column()
  readonly status: string;
}
