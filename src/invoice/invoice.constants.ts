export const INVOICE_READ_REPOSITORY = 'INVOICE_READ_REPOSITORY';

export type InvoiceStatus = 'UNPAID' | 'PAID';
export enum InvoiceStatusEnum {
  UNPAID = '0',
  PAID = '1',
}

/**
 * @deprecated use `InvoiceStatus` instead
 */
export type InvoiceType = 'UNPAID' | 'PAID';
export enum InvoiceTypeEnum {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}
