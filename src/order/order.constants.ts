import { Division } from '@wings-corporation/core';

/**
 * The type of buyer. Same as `Division`
 */
export type BuyerType = Division;

export const ORDER_READ_REPOSITORY = 'ORDER_READ_REPOSITORY';
export const PRODUCT_SEARCH_READ_REPOSITORY = 'PRODUCT_SEARCH_READ_REPOSITORY';

export type DeliveryAddressType = Division | 'ANY';

export const ORDER_WRITE_REPOSITORY = 'ORDER_WRITE_REPOSITORY';

export const LEGACY_ORDER_SERVICE = 'LEGACY_ORDER_SERVICE';
export const SFA_SERVICE = 'SFA_SERVICE';

export enum FlagCancelOrder {
  SKIP = 'skip',
  RECALL = 'recall',
  QUEUE = 'queue',
  CHECKOUT = 'checkout',
  PROCESSED = 'processed',
}

export enum FlagTriggerCancel {
  CANCEL = 'C',
  SYSTEM_CANCEL = 'DO',
}

export const DEFAULT_CANCEL_DURATION = 60; // minutes
export const TRANSACTION_DATE_LIMIT = 14; //days

export enum OrderStatus {
  NOT_CONFIRMED = <any>'0',
  CONFIRMED = <any>'1',
  CANCELLED_BY_CUSTOMER = <any>'1C',
  PROCESSING = <any>'2',
  PREPARING_A = <any>'3A',
  PREPARING_B = <any>'3B',
  CANCELLED_BY_SYSTEM = <any>'3C',
  SHIPPED = <any>'4',
  ARRIVED = <any>'5',
  RECEIVED = <any>'6',
  RECEIVED_PARTIALLY = <any>'7',
  RETURNED = <any>'8',
  DELIVERY_FAILED = <any>'9',
}

export enum MATERIAL_PACK_UOM {
  PCS = 'PCS',
  BOX = 'BOX',
  CTN = 'CTN',
  PAC = 'PAC',
  PAK = 'PAK',
  KRG = 'KRG',
}

export enum DeliveryStatusEnum {
  COMPLETE = 'Completely Processed',
  PARTIAL = 'Partially processed',
}

export type OrderState = 'DELIVERED' | 'UNDELIVERED' | 'ANY';
