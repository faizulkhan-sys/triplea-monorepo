import { Module } from '@nestjs/common';
import * as typeOrmConfig from './typeorm.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import transports from '@utils/winstonTransports';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@common/interceptor/logger.interceptor';
import { EmployeeAuthModule } from '@modules/employee-auth/employee-auth.module';

@Module({
  imports: [
    EmployeeAuthModule,
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'EmployeeAuthOperation' },
      transports: transports,
      exceptionHandlers: [
        new winston.transports.File({
          filename: 'logs/exceptions.log',
        }),
      ],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
