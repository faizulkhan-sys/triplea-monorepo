import { Permission } from '@entities/Permission';
import { Users } from '@entities/Users';
import { UsersTemp } from '@entities/UsersTemp';
import { UserType } from '@entities/UserType';
import { Customer } from '@entities/Customer.entity';
import { WorkLog } from '@entities/WorkLog.entity';
import { IdEmployeeDto, CheckEmail } from '@dtos/Derived.dto';
import { WrongUserFound } from '@dtos/wronguser.dto';
import { WrongUserLog } from '@entities/WrongUserLog';
import { InviteEmployerLog } from '@entities/InviteEmployerLog';
import { InviteUserMobile } from '@dtos/Derived.dto';
import { NotifyDto } from '@dtos/Notify.dto';
import { UpdateUser } from '@dtos/UpdateUser.dto';
import { CreateUser } from '@dtos/CreateUser.dto';
import { UserTypeTemp } from '@entities/UserTypeTemp';
import { CreateUserType } from '@dtos/CreateUserType.dto';
import { PermissionUserType } from '@entities/PermissionUserType';
import { UpdateUserTypeName } from '@dtos/UpdateUserTypeName.dto';
import { PermissionUserTypeTemp } from '@entities/PermissionUserTypeTemp';
import { UpdateUserTypePermissions } from '@dtos/UpdateUserTypePermission.dto';
import { Repository } from 'typeorm';
import { IResponse, Ipagination, response } from '@common/interfaces/response.interface';
import { ListActiveUserDto, ListPendingDto, ListActiveUserTypeDto } from '@dtos/ListQuery.dto';
import { AddOrChangeNumber } from '@dtos/Derived.dto';
import { ServiceBusSenderService } from '@modules/service-bus-sender/service-bus-sender.service';
import { ApproveRejectDto } from '@dtos/AppproverReject.dto';
import { CompanyUser } from '@entities/CompanyUser';
export declare class UserOperationService {
    private readonly permissionRepo;
    private readonly permissionUserTypeRepo;
    private readonly permissionUserTypeTemp;
    private readonly serviceBusService;
    private readonly usersRepo;
    private readonly wrongUserLogRepo;
    private readonly inviteEmployerRepo;
    private readonly usersTempRepo;
    private readonly userTypeRepo;
    private readonly customerRepository;
    private readonly workLogRepo;
    private readonly userTypeTempRepo;
    private readonly companyUserRepo;
    constructor(permissionRepo: Repository<Permission>, permissionUserTypeRepo: Repository<PermissionUserType>, permissionUserTypeTemp: Repository<PermissionUserTypeTemp>, serviceBusService: ServiceBusSenderService, usersRepo: Repository<Users>, wrongUserLogRepo: Repository<WrongUserLog>, inviteEmployerRepo: Repository<InviteEmployerLog>, usersTempRepo: Repository<UsersTemp>, userTypeRepo: Repository<UserType>, customerRepository: Repository<Customer>, workLogRepo: Repository<WorkLog>, userTypeTempRepo: Repository<UserTypeTemp>, companyUserRepo: Repository<CompanyUser>);
    getEmployerByName(query: string): Promise<{
        data: Users[];
    }>;
    getEmployerByZip(query: string): Promise<{
        data: {
            idx: string;
            contact_name: string;
            company_name: string;
            zip_code: string;
        }[];
    }>;
    wrongUserFound(wrongUser: WrongUserFound): Promise<IResponse>;
    getUserByIdx(idx: string): Promise<Users>;
    contactMe(employer_email: string): Promise<IResponse>;
    inviteEmployerMobile(inviteDto: InviteUserMobile): Promise<IResponse>;
    setNotification(inviteDto: NotifyDto): Promise<IResponse>;
    getAllUsers(listQuery: ListActiveUserDto): Promise<Ipagination>;
    getAllPendingUsers(listQuery: ListPendingDto, userRequesting: Users): Promise<Ipagination>;
    getAPendingUser(idx: string): Promise<any>;
    updateUser(user: UpdateUser, idx: string, userRequesting: Users): Promise<IResponse>;
    createUser(user: CreateUser, userRequesting: Users): Promise<any>;
    deleteUser(idx: string, userRequesting: Users): Promise<IResponse>;
    verifyUserOperation(approveRejectDto: ApproveRejectDto, idxVal: string, userRequesting: Users): Promise<IResponse>;
    enableDisable(operation: string, idx: string, userRequesting: Users): Promise<IResponse>;
    calculateWage(idx: string, employer_id: string): Promise<any>;
    employeeStatus(idx: string): Promise<{
        sa_status: string;
        is_bank_set: boolean;
        is_mobile_set: boolean;
        is_mpin_set: boolean;
        is_debitcard: boolean;
        mobile_number: string;
    }>;
    hoursWorked(employee: Customer): Promise<any>;
    idEmployee(idEmployee: IdEmployeeDto): Promise<{
        statusCode: number;
        data: any;
    }>;
    checkEmail(emailDto: CheckEmail): Promise<IResponse>;
    getAllCustomerByIdx(idx: string): Promise<Customer>;
    setFcm(idx: string, fcm_key: string, platform: string): Promise<IResponse>;
    requestSaFeature(idx: string): Promise<IResponse>;
    addorChangeMobileNumber(idx: string, addOrChangeNumber: AddOrChangeNumber, operation: string): Promise<IResponse>;
    resetUser(employee: Customer): Promise<IResponse>;
    getAllUserType(listUserType: ListActiveUserTypeDto): Promise<Ipagination>;
    getAllPendingUserType(listpendingDto: ListPendingDto, userRequesting: Users): Promise<Ipagination>;
    getPendingUserTypeByIdx(idx: string): Promise<{
        new_userType: Record<string, any>;
        current_userType: Record<string, any>;
    }>;
    getAUserType(idx: string): Promise<unknown>;
    createUsertype(dto: CreateUserType, userRequesting: Users): Promise<response>;
    deleteUserType(idx: string, userRequesting: Users): Promise<response>;
    updateUserTypeName(userType: UpdateUserTypeName, idx: string, userRequesting: Users): Promise<response>;
    VerifyUserType(merchantData: ApproveRejectDto, idxVal: string, userRequesting: Users): Promise<{
        statusCode: number;
        message: string;
    }>;
    CheckPermissionExists(permissionArray: Array<string>): Promise<boolean>;
    updateUserTypePermissions(userType: UpdateUserTypePermissions, idx: string, userRequesting: Users): Promise<response>;
}
