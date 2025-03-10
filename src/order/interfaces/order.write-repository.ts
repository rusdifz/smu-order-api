import { UserIdentity } from '@wings-online/common';

import { OrderAggregate } from '../domains';

export interface IOrderWriteRepository {
  /**
   *
   * @param id
   * @param identity
   */
  getById(
    id: number,
    identity: UserIdentity,
    isDummy: boolean,
  ): Promise<OrderAggregate | undefined>;

  /**
   *
   * @param order
   */
  save(order: OrderAggregate, isDummy: boolean): Promise<void>;
}
