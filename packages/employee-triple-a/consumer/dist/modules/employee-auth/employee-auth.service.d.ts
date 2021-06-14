import { Customer } from '@entities/Customer.entity';
import { Protocol } from '@entities/Protocol.entity';
import { ActivityLog } from '@entities/ActivityLog.entity';
import { OtpLog } from '@entities/OtpLog.entity';
import { Repository } from 'typeorm';
import { SearchFilters } from '@entities/SearchFilters.entity';
export declare class EmployeeAuthService {
    private readonly searchFilterRepo;
    private readonly customerRepository;
    private readonly protocolRepo;
    private readonly activityLogRepo;
    private readonly otpLogRepository;
    constructor(searchFilterRepo: Repository<SearchFilters>, customerRepository: Repository<Customer>, protocolRepo: Repository<Protocol>, activityLogRepo: Repository<ActivityLog>, otpLogRepository: Repository<OtpLog>);
    loginEmployeeSaveActivity(data: any): Promise<any>;
    loginEmployeeSaveActivityForFailed(data: any): Promise<any>;
    loginEmployeeUpdateActivity(data: any): Promise<any>;
    loginUpdateEmployeeAccount(data: any): Promise<any>;
    resetMpin(data: any): Promise<any>;
    forgetMpin(data: any): Promise<any>;
    changeMpin(data: any): Promise<any>;
    changePassword(data: any): Promise<any>;
    resetPassword(data: any): Promise<any>;
    verifyMpin(data: any): Promise<any>;
    setMpin(data: any): Promise<any>;
    forgotPassword(data: any): Promise<any>;
    signupEmployee(data: any): Promise<any>;
    createFilter(data: any): Promise<any>;
    upadateFilter(data: any): Promise<any>;
    deleteFilter(data: any): Promise<any>;
}