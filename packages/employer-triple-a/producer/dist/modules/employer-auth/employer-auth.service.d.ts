import { SetPassword } from '@dtos/SetPassword.dto';
import { EmployerLoginDto } from '@dtos/employerLogin.dto';
import { EmailLog } from '@entities/EmailLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog';
import { Permission } from '@entities/Permission';
import { Protocol } from '@entities/Protocol';
import { Users } from '@entities/Users';
import { OtpLog } from '@entities/OtpLog';
import { ChangeUserPass } from '@dtos/ChangeUserPass.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '@modules/token/tokens.service';
import { IResponse } from '@common/interfaces/response.interface';
import { UserLoginDto, ForgotPassword, ResetPassword } from '@dtos/Derived.dto';
import { ServiceBusSenderService } from '@modules/service-bus-sender/service-bus-sender.service';
import { ProtocolUpdateDto } from '@dtos/protocol.dto';
import { EmployerSettings } from '@entities/EmployerSettings.entity';
import { AddUpdatesettings } from '@dtos/create-setting.dto';
import { ActivityLog } from '@entities/ActivityLog';
export declare class EmployerAuthService {
    private readonly jwtService;
    private readonly tokenService;
    private readonly serviceBusService;
    private readonly usersRepo;
    private readonly activityLogRepo;
    private readonly emailLogRepo;
    private readonly permissionRepo;
    private readonly protocolRepo;
    private readonly employerSettingsRepo;
    private readonly otpRepo;
    private readonly passwordHistoryRepo;
    private readonly nanoid;
    constructor(jwtService: JwtService, tokenService: TokensService, serviceBusService: ServiceBusSenderService, usersRepo: Repository<Users>, activityLogRepo: Repository<ActivityLog>, emailLogRepo: Repository<EmailLog>, permissionRepo: Repository<Permission>, protocolRepo: Repository<Protocol>, employerSettingsRepo: Repository<EmployerSettings>, otpRepo: Repository<OtpLog>, passwordHistoryRepo: Repository<PasswordHistoryLog>);
    loginEmployer(userDto: EmployerLoginDto, ip: string): Promise<{
        message: string;
        accessToken: string;
        response: {
            provider_name: string;
            contact_name: string;
            idx: string;
        };
    }>;
    loginUser(userDto: UserLoginDto, ip: string): Promise<{
        message: string;
        accessToken: string;
        response: {
            id: number;
            idx: string;
            email: string;
            address: string;
            contact_name: string;
            is_superadmin: boolean;
        };
    }>;
    checkLink(token: string): Promise<IResponse>;
    setPassword(passwordDto: SetPassword): Promise<IResponse>;
    authenticateRoute(header: {
        data?: string;
        method?: any;
        url?: any;
    }, result: any[]): Promise<boolean>;
    sendAllMappedRoutes(allAccessibleRoutes: any[]): Promise<{}>;
    listAllAccessibleAlias(userRequesting: Users): Promise<any>;
    getAllPermission(query?: string): Promise<Permission[]>;
    getPermissionByIdx(idx: string): Promise<Permission>;
    getAllProtocol(): Promise<Protocol[]>;
    updateProtocol(idx: string, protocolUpdate: ProtocolUpdateDto): Promise<IResponse>;
    getSetting(idx: string): Promise<EmployerSettings>;
    addUpdateSettings(settingsDto: AddUpdatesettings, idx: string): Promise<IResponse>;
    forgotPassword(forgotPassword: ForgotPassword): Promise<IResponse>;
    resetPassword(resetPassword: ResetPassword): Promise<IResponse>;
    changePassword(password: ChangeUserPass, idx: string): Promise<IResponse>;
}
