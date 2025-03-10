import { SuggestProductSearchReadModel } from '@wings-online/order/read-models';

export class SuggestSearchOrderResult {
  readonly data: SuggestProductSearchReadModel;

  constructor(props: SuggestProductSearchReadModel) {
    this.data = props;
  }
}
