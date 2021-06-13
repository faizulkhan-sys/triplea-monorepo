import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config/index';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestSanitizerInterceptor } from './common/interceptor/requestSanitizer.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


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
    .useGlobalInterceptors(new TimeoutInterceptor())
    .setGlobalPrefix('v1')
    .enableCors();

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const options = new DocumentBuilder()
  .setTitle('Employee Api')
  .setBasePath('v1')
  .setDescription(
    'The Employee API description built using swagger OpenApi. You can find out more about Swagger at http://swagger.io',
  )
  .setVersion('1.0')
  .addBearerAuth({
    type:'http',scheme:'bearer',bearerFormat:'Token'},
    'access-token',
  )
  .build();

const document = SwaggerModule.createDocument(app, options);

SwaggerModule.setup('api', app, document);

  await app.listen(config.port);

  console.info(`Operation server running on 🚀 http://localhost:${config.port}`);
}

bootstrap();
