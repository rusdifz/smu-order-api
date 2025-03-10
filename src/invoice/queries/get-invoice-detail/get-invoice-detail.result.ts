import {
  InvoiceDetailReadModel,
  JsonInvoiceDetailProps,
} from '@wings-online/invoice/read-models';

export class GetInvoiceDetailResult {
  readonly data: JsonInvoiceDetailProps;

  constructor(props: InvoiceDetailReadModel) {
    this.data = props.toJSON();
  }
}
