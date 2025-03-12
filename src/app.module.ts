import { ValidationOptions } from 'joi';

import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule, TypeOrmPinoLogger } from '@wings-online/common';
import { MutexModule } from '@wings-corporation/nest-advisory-lock-mutex';
import { AuthModule } from '@wings-corporation/nest-auth';
import { EventBusModule } from '@wings-corporation/nest-event-bus';
import { LoggerModule, XRayLogger } from '@wings-corporation/nest-pino-logger';
import { TracingModule, XRAY_CLIENT } from '@wings-corporation/nest-xray';

import { EVENTBRIDGE_CLIENT_TOKEN, S3_CLIENT_TOKEN } from './app.constants';
import { AuthService } from './auth';
import { TypeOrmUserInfoEntity } from './auth/entities/typeorm.user-info.entity';
import { TypeOrmUserEntity } from './auth/entities/typeorm.user.entity';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { configSchema } from './config';
import { InvoiceModule } from './invoice';
import { OrderModule } from './order';
import { ParameterModule } from './parameter/parameter.module';
import { ParameterService } from './parameter/parameter.service';
import {
  AuthModuleOptionsProvider,
  EventBridgeClientFactoryProvider,
  EventBusFactoryProvider,
  S3ClientFactoryProvider,
  TypeOrmModuleOptionsProvider,
} from './providers';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      } as ValidationOptions,
    }),
    TracingModule.forRootAsync({
      inject: [XRayLogger],
      useFactory: (logger: XRayLogger) => ({
        logger,
      }),
    }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService, TypeOrmPinoLogger, XRAY_CLIENT],
      extraProviders: [TypeOrmPinoLogger],
      useClass: TypeOrmModuleOptionsProvider,
    }),
    TypeOrmModule.forFeature([TypeOrmUserEntity, TypeOrmUserInfoEntity]),
    MutexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.getOrThrow('PG_DATABASE_WRITE_URL'),
      }),
    }),
    EventBusModule.forRootAsync({
      inject: [ConfigService, EVENTBRIDGE_CLIENT_TOKEN, S3_CLIENT_TOKEN],
      useFactory: EventBusFactoryProvider,
      extraProviders: [
        {
          provide: EVENTBRIDGE_CLIENT_TOKEN,
          inject: [ConfigService],
          useFactory: EventBridgeClientFactoryProvider,
        },
        {
          provide: S3_CLIENT_TOKEN,
          inject: [ConfigService],
          useFactory: S3ClientFactoryProvider,
        },
      ],
    }),
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useClass: AuthModuleOptionsProvider,
      extraProviders: [AuthService],
    }),
    OrderModule,
    HealthModule,
    InvoiceModule,
    ParameterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService) => {
        const timeoutInMilliseconds: number = configService.getOrThrow<number>(
          'TIMEOUT_IN_MILLISECONDS',
        );
        return new TimeoutInterceptor(timeoutInMilliseconds);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly parameterService: ParameterService) {}

  async onApplicationBootstrap() {
    await this.parameterService.loadParameters();
  }
}
