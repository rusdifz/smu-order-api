import { Logger } from 'typeorm';

import { Injectable } from '@nestjs/common';
import {
  InjectPinoLogger,
  PinoLogger,
} from '@wings-corporation/nest-pino-logger';

export const HEARTBEAT_QUERY = 'SELECT 1';
export const SCHEMA_DISCOVERY_QUERY = 'SELECT * FROM current_schema()';
export const SERVER_VERSION_QUERY = 'SELECT version();';

@Injectable()
export class TypeOrmPinoLogger implements Logger {
  constructor(@InjectPinoLogger('TypeORM') readonly logger: PinoLogger) {}

  logQuery(query: string, parameters?: any[]) {
    if (
      query !== HEARTBEAT_QUERY &&
      query !== SCHEMA_DISCOVERY_QUERY &&
      query !== SERVER_VERSION_QUERY
    ) {
      this.logger.debug({ query, parameters }, `query executed`);
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error(
      {
        query,
        parameters,
        error: error instanceof Error ? error.message : error,
      },
      `query failed`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(
      { query, parameters, duration: time },
      `slow query detected`,
    );
  }

  logSchemaBuild(message: string) {
    this.logger.info(message);
  }

  logMigration(message: string) {
    this.logger.info(message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      default:
        this.logger.debug(message);
        break;
    }
  }
}
