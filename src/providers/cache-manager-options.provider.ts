import { createKeyv } from '@keyv/redis';
import { CacheManagerOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

export const CacheManagerOptionsProvider = (
  configService: ConfigService,
): CacheManagerOptions => {
  const redisStore = createKeyv(configService.getOrThrow('REDIS_URL'));
  return {
    stores: [redisStore],
  };
};
