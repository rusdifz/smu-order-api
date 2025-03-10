import { DateTime } from 'luxon';

type OverdueInvoiceReadModelProps = {
  id: number;
  amount: number;
  dueDate: Date;
};

export class OverdueInvoiceReadModel {
  public constructor(readonly props: OverdueInvoiceReadModelProps) {}

  get isOverdue(): boolean {
    const overdueDate = DateTime.fromJSDate(this.props.dueDate, {
      zone: 'Asia/Jakarta',
    })
      .plus({ days: 1 })
      .endOf('day')
      .toJSDate();
    return new Date().getTime() >= overdueDate.getTime();
  }
}
