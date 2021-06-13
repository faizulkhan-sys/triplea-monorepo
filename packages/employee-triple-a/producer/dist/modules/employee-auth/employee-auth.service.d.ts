import { ServiceBusSenderService } from '@modules/service-bus-sender/service-bus-sender.service';
import { Customer } from '@entities/Customer.entity';
import { Protocol } from '@entities/Protocol.entity';
import { Criterias } from '@entities/Criterias.entity';
import { ActivityLog } from '@entities/ActivityLog.entity';
import { TokensService } from '@modules/token/tokens.service';
import { Logger } from '@nestjs/common';
import { ChangeMpin, ChangePassword, ForgotPassword, ResetMpin, ResetPassword, SetMpin, SignUpEmployee } from '@dtos/Derived.dto';
import { OtpLog } from '@entities/OtpLog.entity';
import { EmployeeLoginDto } from '@dtos/employeeLogin.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { ListQueryDto } from '@dtos/ListQuery.dto';
import { Repository } from 'typeorm';
import { SearchFilters } from '@entities/SearchFilters.entity';
import { CreateFilterDto } from '@dtos/AddFilter';
import { ExecuteFilter } from '@dtos/Derived.dto';
import { UpdateFilterDto } from '@dtos/UpdateFilter';
export declare class EmployeeAuthService {
    private readonly criteriaRepo;
    private readonly searchFilterRepo;
    private readonly customerRepository;
    private readonly protocolRepo;
    private readonly otpLogRepository;
    private readonly activityLogRepo;
    private readonly serviceBusService;
    private readonly tokenService;
    private readonly logger;
    private readonly nanoid;
    constructor(criteriaRepo: Repository<Criterias>, searchFilterRepo: Repository<SearchFilters>, customerRepository: Repository<Customer>, protocolRepo: Repository<Protocol>, otpLogRepository: Repository<OtpLog>, activityLogRepo: Repository<ActivityLog>, serviceBusService: ServiceBusSenderService, tokenService: TokensService, logger: Logger);
    loginEmployee(emplLogin: EmployeeLoginDto): Promise<any>;
    resetMpin(resetMpin: ResetMpin): Promise<IResponse>;
    forgetMpin(employee: Customer): Promise<IResponse>;
    changeMpin(employee: Customer, mpinDto: ChangeMpin): Promise<IResponse>;
    changePassword(changePassword: ChangePassword, employee: Customer): Promise<IResponse>;
    resetPassword(resetPassword: ResetPassword): Promise<IResponse>;
    verifyMpin(employee: Customer, mpinDto: SetMpin): Promise<{
        statusCode: number;
        message: string;
    }>;
    setMpin(employee: Customer, mpinDto: SetMpin): Promise<IResponse>;
    checkOtp(otp_code: string): Promise<OtpLog>;
    verifyOtp(otp_code: string): Promise<IResponse>;
    forgotPassword(forgotPassword: ForgotPassword): Promise<IResponse>;
    signupEmployee(signUpDto: SignUpEmployee): Promise<any>;
    logoutFromAll(employee: Customer): Promise<IResponse>;
    logout(employee: Customer, refreshToken: string): Promise<IResponse>;
    changePasswordIdx(idx: string): Promise<IResponse>;
    getAllfilters(listQuery: ListQueryDto, idx: string): Promise<any>;
    createFilter(createDto: CreateFilterDto, idx: string): Promise<IResponse>;
    getFilterByIdx(idx: string, emploerIdx: string): Promise<SearchFilters>;
    executeFilterOnce(createDto: ExecuteFilter, idx: string): Promise<{
        count: number;
    }>;
    upateFilter(updateDto: UpdateFilterDto, idx: string, employerIdx: string): Promise<IResponse>;
    deleteFilter(idx: string, employerIdx: string): Promise<IResponse>;
}
