import {
  InvoiceOverdueReadModel,
  JsonInvoiceOverdueProps,
} from '@wings-online/invoice/read-models';

export class GetInvoiceOverdueResult {
  readonly data: JsonInvoiceOverdueProps;

  constructor(props: InvoiceOverdueReadModel) {
    this.data = props.toJSON();
  }
}
