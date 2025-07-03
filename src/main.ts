import tracer from 'dd-trace';
import fastifyXray from 'fastify-xray';
import helmet from 'helmet';
import { kebabCase } from 'lodash';

import { RequestMethod, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DomainException } from '@wings-corporation/core';
import {
  ExtractRequestId,
  FastifyAdapter,
} from '@wings-corporation/nest-fastify';
import {
  CatchAllExceptionFilter,
  DomainExceptionFilter,
  JoiSchemaValidationPipe,
  NotFoundExceptionFilter,
  ResponseEnvelopeInterceptor,
} from '@wings-corporation/nest-http';
import { Logger } from '@wings-corporation/nest-pino-logger';
import { getXRayInstance } from '@wings-corporation/nest-xray';

import { ServiceName } from './app.constants';
import { AppModule } from './app.module';
import { JsonSerializerInterceptor, QueryStringPipe } from './common/';

tracer.init({
  service: 'wo-identity-service',
  logInjection: true,
  runtimeMetrics: true,
  startupLogs: true,
});

async function bootstrap() {
  const adapter = FastifyAdapter.create({
    idFromRequest: ExtractRequestId.fromAmazonTraceHeader(),
    plugins: [
      {
        plugin: fastifyXray,
        opts: {
          defaultName: process.env.AWS_XRAY_TRACING_NAME || ServiceName,
          AWSXRay: getXRayInstance(),
        } as fastifyXray.FastifyXrayOptions,
      },
    ],
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    { bufferLogs: true },
  );

  const config = app.get(ConfigService);

  app.enableVersioning({ type: VersioningType.URI });
  app.useLogger(app.get(Logger));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalInterceptors(new JsonSerializerInterceptor());

  app.useGlobalFilters(
    new CatchAllExceptionFilter(),
    new DomainExceptionFilter({
      getErrorCode: (exception: DomainException) => {
        return kebabCase(exception.message);
      },
    }),
    new NotFoundExceptionFilter(),
  );
  app.useGlobalPipes(new QueryStringPipe(), new JoiSchemaValidationPipe());
  app.setGlobalPrefix('/v2/order', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.flushLogs();

  await app.listen(config.getOrThrow('PORT'), '0.0.0.0');
}
bootstrap();
