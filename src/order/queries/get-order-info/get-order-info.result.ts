import {
  JsonOrderProps,
  OrderReadModel,
} from '@wings-online/order/read-models';

export class GetOrderInfoResult {
  readonly order: JsonOrderProps;

  constructor(props: OrderReadModel) {
    this.order = props.toJSONDetail();
  }
}
