import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONNECTIONNAME_DB_S4 } from '@wings-online/app.constants';
import { TypeOrmParameterS4Entity } from './entities';
import { ParameterS4Service } from './parameters4.service';

@Module({})
export class ParameterS4Module {
  public static forRoot(): DynamicModule {
    const imports = [TypeOrmModule.forFeature([TypeOrmParameterS4Entity], CONNECTIONNAME_DB_S4)];
    const providers = [{
        provide: CONNECTIONNAME_DB_S4,
        useValue: CONNECTIONNAME_DB_S4, // or the actual data source instance
      },
      ParameterS4Service
    ];
    const exports = [ParameterS4Service];

    return {
      global: true,
      module: ParameterS4Module,
      providers,
      imports,
      exports,
    };
  }
}
