import { IResponse, Ipagination, response } from '@common/interfaces/response.interface';
import { WrongUserFound } from '@dtos/wronguser.dto';
import { UserOperationService } from '@modules/user-operation/user-operation.service';
import { ContactMe, InviteUserMobile } from '@dtos/Derived.dto';
import { NotifyDto } from '@dtos/Notify.dto';
import { ListActiveUserDto, ListPendingDto, ListActiveUserTypeDto } from '@dtos/ListQuery.dto';
import { UpdateUser } from '@dtos/UpdateUser.dto';
import { CreateUser } from '@dtos/CreateUser.dto';
import { EnableDisable } from '@dtos/EnableDisabledto';
import { ApproveRejectDto } from '@dtos/AppproverReject.dto';
import { FcmDto } from '@dtos/fcm.dto';
import { CreateUserType } from '@dtos/CreateUserType.dto';
import { UpdateUserTypeName } from '@dtos/UpdateUserTypeName.dto';
import { UpdateUserTypePermissions } from '@dtos/UpdateUserTypePermission.dto';
import { HttpService } from '@nestjs/common';
import { Users } from '@entities/Users';
import { IdEmployeeDto, CheckEmail, AddOrChangeNumber } from '@dtos/Derived.dto';
import { Customer } from '@entities/Customer.entity';
export declare class UserOperationController {
    private readonly userOpsService;
    private readonly httpService;
    constructor(userOpsService: UserOperationService, httpService: HttpService);
    getEmployerByName(query: string): Promise<any[] | {
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
    getEmployerByIdx(idx: string): Promise<Users>;
    contactMe(contactMe: ContactMe): Promise<IResponse>;
    invitemeployerMobile(userData: InviteUserMobile): Promise<IResponse>;
    setNotificationForEmployee(userData: NotifyDto): Promise<IResponse>;
    getAllPendingUsers(listQuery: ListPendingDto, userRequesting: Users): Promise<Ipagination>;
    GetPendingCustomerByIdx(idx: string): Promise<any>;
    createUser(userData: CreateUser, userRequesting: Users): Promise<any>;
    deleteUser(idx: string, userRequesting: Users): Promise<IResponse>;
    changeUserStatus(approveReject: ApproveRejectDto, idx: string, userRequesting: Users): Promise<IResponse>;
    enableDisableUser(enableDisable: EnableDisable, idx: string, userRequesting: Users): Promise<IResponse>;
    calculateWage(employee: Customer): Promise<any>;
    employeeStatus(employee: Customer): Promise<{
        sa_status: string;
        is_bank_set: boolean;
        is_mobile_set: boolean;
        is_debitcard: boolean;
        is_mpin_set: boolean;
        mobile_number: string;
    }>;
    totalHoursWorked(employee: Customer): Promise<any>;
    idEmployee(idEmployee: IdEmployeeDto): Promise<{
        statusCode: number;
        data: any;
    }>;
    checkEmail(emailDto: CheckEmail): Promise<IResponse>;
    employeeMobile(idx: string): Promise<Customer>;
    setFcm(employee: Customer, fcmDto: FcmDto): Promise<IResponse>;
    requestSaFeature(employee: Customer): Promise<IResponse>;
    addMobileNumber(addNumber: AddOrChangeNumber, employee: Customer): Promise<IResponse>;
    changeMobileNumber(changeNumber: AddOrChangeNumber, employee: Customer): Promise<IResponse>;
    resetUser(employee: Customer): Promise<IResponse>;
    getAlluserType(listUserType: ListActiveUserTypeDto): Promise<Ipagination>;
    GetAllPendingRoles(listPendingDto: ListPendingDto, userRequesting: Users): Promise<Ipagination>;
    getPendingUserTypeByIdx(idx: string): Promise<any>;
    getOneByIdx(idx: string): Promise<unknown>;
    createUserType(dto: CreateUserType, userRequesting: Users): Promise<response>;
    deleteUserType(idx: string, userRequesting: Users): Promise<response>;
    updateUserTypeName(userType: UpdateUserTypeName, idx: string, userRequesting: Users): Promise<response>;
    changeUserTypeStatus(approveReject: ApproveRejectDto, idx: string, userRequesting: Users): Promise<response>;
    updateUserTypePermissions(userType: UpdateUserTypePermissions, idx: string, userRequesting: Users): Promise<response>;
    updateUser(user: UpdateUser, idx: string, userRequesting: Users): Promise<IResponse>;
    getAllUser(listQuery: ListActiveUserDto): Promise<Ipagination>;
    getUserByIdx(idx: string): Promise<Users>;
}
