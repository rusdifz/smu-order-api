import { OrderReadModel } from '@wings-online/order/read-models';
import { JsonTrackingStatusProps } from '@wings-online/order/read-models/tracking-status.read-model';

export class GetOrderStatusHistoryResult {
  readonly histories: JsonTrackingStatusProps[];

  constructor(props: OrderReadModel) {
    this.histories =
      props.trackings?.map((tracking) => tracking.toJSON()) || [];
  }
}
