import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from '@config/index';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestSanitizerInterceptor } from '@common/interceptor/requestSanitizer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ================================
  // configureExpressSettings
  // ================================

  app.set('etag', 'strong');
  app.set('trust proxy', true);

  // =================================
  // configureNestGlobals
  // =================================

  app
    .use(compression())
    .use(helmet())
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        validationError: { target: false },
      }),
    )
    .useGlobalInterceptors(new RequestSanitizerInterceptor())
    .setGlobalPrefix('v1')
    .enableCors();

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(config.port);

  console.info(`Operation server running on 🚀 http://localhost:${config.port}`);
}

bootstrap();
