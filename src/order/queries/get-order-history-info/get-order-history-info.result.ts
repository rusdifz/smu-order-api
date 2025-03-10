import {
  JsonOrderProps,
  OrderReadModel,
} from '@wings-online/order/read-models';

export class GetOrderHistoryInfoResult {
  readonly order: JsonOrderProps;

  constructor(props: OrderReadModel) {
    this.order = props.toJSONDetail();
  }
}
