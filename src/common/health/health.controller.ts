import { DataSource } from 'typeorm';

import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { Public } from '@wings-corporation/nest-http';
import { HEALTH_CHECK_PATH } from '@wings-online/app.constants';
import { CONNECTIONNAME_DB_S4 } from 'src/app.constants';

@Controller(HEALTH_CHECK_PATH)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectDataSource(CONNECTIONNAME_DB_S4)
    private dataSourceS4: DataSource,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.db.pingCheck('database ECC', {
          timeout: 1000,
          connection: this.dataSource,
        }),
      () => this.db.pingCheck('database S4', {
          timeout: 1000,
          connection: this.dataSourceS4,
        }),
    ]);
  }
}
