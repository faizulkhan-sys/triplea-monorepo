import { Module } from '@nestjs/common';
import { UserOperationService } from './user-operation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@entities/Customer.entity';
import { ActivityLog} from '@entities/ActivityLog.entity'
import { Protocol } from '@entities/Protocol.entity';
import { TokenModule } from '@modules/token/token.module';
import { Users } from '@entities/Users';
import { UsersTemp } from '@entities/UsersTemp';
import { UserType } from '@entities/UserType';
import { CompanyUser } from '@entities/CompanyUser';
import { WrongUserLog } from '@entities/WrongUserLog';
import { InviteEmployerLog } from '@entities/InviteEmployerLog';
import { UserTypeTemp } from '@entities/UserTypeTemp';
import { Permission } from '@entities/Permission';
import { PermissionUserTypeTemp } from '@entities/PermissionUserTypeTemp';
import { PermissionUserType } from '@entities/PermissionUserType';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Protocol,
      ActivityLog,
      Users,
      UsersTemp,
      UserType,
      CompanyUser,
      WrongUserLog,
      InviteEmployerLog,
      UserTypeTemp,
      Permission,
      PermissionUserTypeTemp,
      PermissionUserType
    ]),

    TokenModule
  ],
  providers: [UserOperationService],
  exports: [UserOperationService]
})
export class UserOperationModule {}
