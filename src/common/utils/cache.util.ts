import { DateTime } from 'luxon';

import { IIdentity } from '@wings-corporation/core';
import { LEGACY_ORDER_DEFAULT_TIMEZONE } from '@wings-online/app.constants';

export class CacheUtil {
  public static getCacheKey(value: string): string {
    const prefix = process.env.CACHE_PREFIX;
    if (prefix) {
      return `${prefix}:${value}`;
    } else {
      return value;
    }
  }

  public static getCacheKeyByIdentity(
    key: string,
    identity: IIdentity,
  ): string {
    return this.getCacheKeyByParts([key, identity.id]);
  }

  public static getCacheKeyByParts(parts: string[]): string {
    return this.getCacheKey(parts.join(':'));
  }

  public static getTTLToEndOfDayInMs(): number {
    const now = DateTime.now().setZone(LEGACY_ORDER_DEFAULT_TIMEZONE);
    const endOfDay = DateTime.now()
      .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
      .endOf('day');
    return endOfDay.diff(now).milliseconds;
  }
}
