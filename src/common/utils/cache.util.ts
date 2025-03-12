import { IIdentity } from '@wings-corporation/core';

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
}
