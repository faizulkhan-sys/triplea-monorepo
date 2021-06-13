import { Module } from '@nestjs/common';
import { EmployerAuthService } from './employer-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog} from '@entities/ActivityLog';
import { Protocol } from '@entities/Protocol.entity';
import { OtpLog } from '@entities/OtpLog';
import { EmailLog } from '@entities/EmailLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog'
import { Users } from '@entities/Users';
import { EmployerSettings } from '@entities/EmployerSettings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Protocol,
      ActivityLog,
      OtpLog,
      EmailLog,
      PasswordHistoryLog,
      Users,
      EmployerSettings
    ])
  ],
  providers: [EmployerAuthService],
  exports: [EmployerAuthService],
})
export class EmployerAuthModule {}
