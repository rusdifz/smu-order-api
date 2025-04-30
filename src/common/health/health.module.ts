import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CONNECTIONNAME_DB_S4 } from '@wings-online/app.constants';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule],
  providers: [{
    provide: CONNECTIONNAME_DB_S4,
    useValue: CONNECTIONNAME_DB_S4, // or the actual data source instance
  }],
  controllers: [HealthController],
})
export class HealthModule {}
