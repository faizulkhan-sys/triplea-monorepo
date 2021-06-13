import { Module, HttpModule, Inject, Logger} from '@nestjs/common';
import { EmployerAuthService } from './employer-auth.service';
import { EmployerAuthController } from './employer-auth.controller';
// import * as redisStore from 'cache-manager-redis-store';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceBusSenderModule } from '@modules/service-bus-sender/service-bus-sender.module';
import { Protocol } from '@entities/Protocol';
import { Users } from '@entities/Users';
import { EmailLog } from '@entities/EmailLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog';
import { ActivityLog } from '@entities/ActivityLog';
import { TokenModule } from '@modules/token/token.module';
import { Permission } from '@entities/Permission';
import { EmployerSettings } from '@entities/EmployerSettings.entity';
import { OtpLog } from '@entities/OtpLog';
import config from '@config/index';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Protocol,
      Users,
      EmailLog,
      PasswordHistoryLog,
      Permission,
      EmployerSettings,
      OtpLog,
      ActivityLog
    ]),
    JwtModule.register({ secret: config.jwt.secret}),
    ServiceBusSenderModule,
    PassportModule,
		HttpModule,
		// CacheModule.register({
		// 	store: redisStore,
		// 	host: config.redis.host,
		// 	port: config.redis.port,
		// 	ttl: 600,
		// }),
    TokenModule
  ],
  providers: [EmployerAuthService],
  controllers: [EmployerAuthController],
})
export class EmployerAuthModule {
  constructor(
		// @Inject(CACHE_MANAGER) cacheManager: any,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
	) {
		// const client = cacheManager.store.getClient();

		// client.on('error', (error: any) => {
		// 	logger.log('error', error);
		// });
	}
}
