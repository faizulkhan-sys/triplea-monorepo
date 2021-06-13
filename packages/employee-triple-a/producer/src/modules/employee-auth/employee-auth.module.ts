import { Module, HttpModule,Inject, Logger} from '@nestjs/common';
// import * as redisStore from 'cache-manager-redis-store';
import { PassportModule } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EmployeeAuthService } from './employee-auth.service';
import { EmployeeAuthController } from './employee-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceBusSenderModule } from '@modules/service-bus-sender/service-bus-sender.module';
import { TokenModule } from '@modules/token/token.module';
import { SearchFilters } from '@entities/SearchFilters.entity';
import { Customer } from '@entities/Customer.entity';
import { Protocol } from '@entities/Protocol.entity';
import { OtpLog } from '@entities/OtpLog.entity';
import { ActivityLog} from '@entities/ActivityLog.entity';
import { Criterias } from '@entities/Criterias.entity';
import config from '@config/index';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Protocol,
      OtpLog,
	  ActivityLog,
	  SearchFilters,
	  Criterias
    ]),
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
  providers: [EmployeeAuthService],
  controllers: [EmployeeAuthController],
})
export class EmployeeAuthModule {
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
