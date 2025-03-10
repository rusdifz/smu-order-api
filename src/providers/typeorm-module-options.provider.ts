import * as pg from 'pg';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmPinoLogger } from '@wings-online/common';
import { XRAY_CLIENT, XRayClient } from '@wo-sdk/nest-xray';

@Injectable()
export class TypeOrmModuleOptionsProvider implements TypeOrmOptionsFactory {
  private CACHE_TABLE_NAME = 'query_result_cache';

  constructor(
    private readonly config: ConfigService,
    private readonly logger: TypeOrmPinoLogger,
    @Inject(XRAY_CLIENT) private readonly xray: XRayClient,
  ) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      driver: this.xray.capturePostgres(pg),
      type: 'postgres',
      replication: {
        master: {
          url: this.config.getOrThrow('PG_DATABASE_WRITE_URL'),
        },
        slaves: [
          {
            url: this.config.getOrThrow('PG_DATABASE_READ_URL'),
          },
        ],
      },
      cache: {
        type: 'database',
        tableName: this.CACHE_TABLE_NAME,
      },
      synchronize: false,
      autoLoadEntities: true,
      logger: this.logger,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
