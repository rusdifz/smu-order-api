import { IIdentity } from '@wings-corporation/core';

export type UserIdentity = IIdentity & {
  externalId: string;
  isActive: boolean;
  division: DivisionInfo;
  isDummy: boolean;
};

export type DivisionInfo = {
  dry?: IDivisionInfo;
  frozen?: IDivisionInfo;
};

export type IDivisionInfo = {
  payerId?: string;
};
