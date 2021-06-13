import { Module } from '@nestjs/common';
import { EmployeeAuthService } from './employee-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@entities/Customer.entity';
import { ActivityLog} from '@entities/ActivityLog.entity';
import { Protocol } from '@entities/Protocol.entity';
import { OtpLog } from '@entities/OtpLog.entity';
import { SearchFilters } from '@entities/SearchFilters.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Protocol,
      ActivityLog,
      OtpLog,
      SearchFilters
    ]),
  ],
  providers: [EmployeeAuthService],
  exports: [EmployeeAuthService],
})
export class EmployeeAuthModule {}
