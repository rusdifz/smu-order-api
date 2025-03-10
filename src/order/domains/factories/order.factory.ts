import { Injectable } from '@nestjs/common';
import { IAggregateFactory } from '@wo-sdk/domain';

import {
  OrderAggregate,
  OrderProps,
  OrderRequiredProps,
} from '../order.aggregate';

@Injectable()
export class OrderFactory implements IAggregateFactory<number, OrderAggregate> {
  public create(props: OrderRequiredProps): OrderAggregate {
    return OrderAggregate.create(props);
  }

  public reconstitute(props: OrderProps, id: number): OrderAggregate {
    return OrderAggregate.reconstitute(props, id);
  }
}
