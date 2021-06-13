import { Protocol } from '@entities/Protocol.entity';
import { ActivityLog } from '@entities/ActivityLog';
import { OtpLog } from '@entities/OtpLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog';
import { Users } from '@entities/Users';
import { EmployerSettings } from '@entities/EmployerSettings.entity';
import { Repository } from 'typeorm';
export declare class EmployerAuthService {
    private readonly usersRepo;
    private readonly protocolRepo;
    private readonly activityLogRepo;
    private readonly otpLogRepository;
    private readonly employerSettingsRepo;
    private readonly passwordHistoryRepo;
    constructor(usersRepo: Repository<Users>, protocolRepo: Repository<Protocol>, activityLogRepo: Repository<ActivityLog>, otpLogRepository: Repository<OtpLog>, employerSettingsRepo: Repository<EmployerSettings>, passwordHistoryRepo: Repository<PasswordHistoryLog>);
    loginEmployerSaveActivity(data: any): Promise<any>;
    loginEmployerUpdateActivity(data: any): Promise<any>;
    loginUpdateUserAccount(data: any): Promise<any>;
    loginUserUpdateActivity(data: any): Promise<any>;
    loginUserSaveActivity(data: any): Promise<any>;
    setPassword(data: any): Promise<any>;
    updateProtocol(data: any): Promise<any>;
    updateSettings(data: any): Promise<any>;
    forgotPassword(data: any): Promise<any>;
    resetPassword(data: any): Promise<any>;
    changePassword(data: any): Promise<any>;
}
