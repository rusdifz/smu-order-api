import { OrderStatus } from '../order.constants';

export interface ILegacyOrderService {
  changeOrderStatus(params: {
    docNumber: string;
    status: OrderStatus;
  }): Promise<void>;

  isCustomerDummy(customerId: string): Promise<boolean>;
}
