import { GlobalAdvisoryLockIdentifier } from '@wings-online/app.constants';

import { UserIdentity } from '../interfaces';

export class LockUtil {
  public static getOrderLockKey(identity: UserIdentity): string {
    return [GlobalAdvisoryLockIdentifier, identity.id].join('-');
  }
}
