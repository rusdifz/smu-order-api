import { ReadModel } from '@wings-online/common';

export type InvoiceOverdueReadModelProps = {
  overdueAmount: number;
  overdueCount: number;
  total: number;
};

export type JsonInvoiceOverdueProps = {
  overdue: {
    amount: number;
    count: number;
  };
  total: number;
};

export class InvoiceOverdueReadModel extends ReadModel {
  constructor(private readonly props: InvoiceOverdueReadModelProps) {
    super();
  }

  toJSON(): JsonInvoiceOverdueProps {
    return {
      overdue: {
        amount: this.props.overdueAmount,
        count: this.props.overdueCount,
      },
      total: this.props.total,
    };
  }
}
