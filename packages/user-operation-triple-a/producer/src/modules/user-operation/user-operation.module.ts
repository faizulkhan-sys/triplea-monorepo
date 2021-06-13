import { Module, CACHE_MANAGER, CacheModule,HttpModule,Inject, Logger} from '@nestjs/common';
// import * as redisStore from 'cache-manager-redis-store';
import { PassportModule } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserOperationService } from './user-operation.service';
import { UserOperationController } from './user-operation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceBusSenderModule } from '@modules/service-bus-sender/service-bus-sender.module';
import { TokenModule } from '@modules/token/token.module';
import { ActivityLog} from '@entities/ActivityLog.entity';
import { Protocol } from '@entities/Protocol.entity';
import config from '@config/index';
import { Users } from '@entities/Users';
import { UsersTemp } from '@entities/UsersTemp';
import { UserType } from '@entities/UserType';
import { Customer } from '@entities/Customer.entity';
import { WorkLog } from '@entities/WorkLog.entity';
import { WrongUserLog } from '@entities/WrongUserLog';
import { InviteEmployerLog } from '@entities/InviteEmployerLog';
import { UserTypeTemp } from '@entities/UserTypeTemp';
import { Permission } from '@entities/Permission';
import { PermissionUserType } from '@entities/PermissionUserType';
import { PermissionUserTypeTemp } from '@entities/PermissionUserTypeTemp';
import { CompanyUser } from '@entities/CompanyUser';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Protocol,
      ActivityLog,
      Users,
      UsersTemp,
      UserType,
      WorkLog,
      WrongUserLog,
      InviteEmployerLog,
      UserTypeTemp,
      Permission,
      PermissionUserType,
      PermissionUserTypeTemp,
      CompanyUser
    ]),
    ServiceBusSenderModule,
    PassportModule,
		HttpModule,
		// CacheModule.register({
		// 	store: redisStore,
		// 	host: config.redis.host,
		// 	port: config.redis.port,
		// 	ttl: config.redisTTL,
		// }),
    TokenModule
  ],
  providers: [UserOperationService],
  controllers: [UserOperationController],
})
export class UserOperationModule {}
