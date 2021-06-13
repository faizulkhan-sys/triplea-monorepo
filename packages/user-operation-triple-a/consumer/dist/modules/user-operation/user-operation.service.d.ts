import { Permission } from '@entities/Permission';
import { PermissionUserTypeTemp } from '@entities/PermissionUserTypeTemp';
import { Customer } from '@entities/Customer.entity';
import { InviteEmployerLog } from '@entities/InviteEmployerLog';
import { WrongUserLog } from '@entities/WrongUserLog';
import { Users } from '@entities/Users';
import { UsersTemp } from '@entities/UsersTemp';
import { UserType } from '@entities/UserType';
import { PermissionUserType } from '@entities/PermissionUserType';
import { Repository } from 'typeorm';
import { UserTypeTemp } from '@entities/UserTypeTemp';
export declare class UserOperationService {
    private readonly permissionUserTypeRepo;
    private readonly usersTempRepo;
    private readonly inviteEmployerRepo;
    private readonly wrongUserLogRepo;
    private readonly usersRepo;
    private readonly customerRepository;
    private readonly userTypeRepo;
    private readonly userTypeTempRepo;
    private readonly permissionRepo;
    private readonly permissionUserTypeTemp;
    constructor(permissionUserTypeRepo: Repository<PermissionUserType>, usersTempRepo: Repository<UsersTemp>, inviteEmployerRepo: Repository<InviteEmployerLog>, wrongUserLogRepo: Repository<WrongUserLog>, usersRepo: Repository<Users>, customerRepository: Repository<Customer>, userTypeRepo: Repository<UserType>, userTypeTempRepo: Repository<UserTypeTemp>, permissionRepo: Repository<Permission>, permissionUserTypeTemp: Repository<PermissionUserTypeTemp>);
    wrongUserFound(data: any): Promise<any>;
    contactMe(data: any): Promise<any>;
    sendUserCreateNotification(data: any): Promise<any>;
    getAxios(): import("axios").AxiosInstance;
    invitemeployerMobile(data: any): Promise<any>;
    setNotification(data: any): Promise<any>;
    updateUser(data: any): Promise<any>;
    createUser(data: any): Promise<any>;
    createAwaitUser(data: any): Promise<any>;
    deleteUser(data: any): Promise<any>;
    verifyUserOperation(data: any): Promise<any>;
    enableDisable(data: any): Promise<any>;
    setFcm(data: any): Promise<any>;
    addorChangeMobileNumber(data: any): Promise<any>;
    requestSaFeature(data: any): Promise<any>;
    resetUser(data: any): Promise<any>;
    createUserType(data: any): Promise<any>;
    deleteUserType(data: any): Promise<any>;
    updateUserTypeName(data: any): Promise<any>;
    VerifyUserType(data: any): Promise<any>;
    updateUserTypePermissions(data: any): Promise<any>;
}
