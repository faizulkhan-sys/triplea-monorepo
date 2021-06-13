"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperationService = void 0;
const Operations_enum_1 = require("../../common/constants/mapping/Operations.enum");
const Permission_1 = require("../../entities/Permission");
const PermissionUserTypeTemp_1 = require("../../entities/PermissionUserTypeTemp");
const axios_1 = require("axios");
const https = require("https");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Status_enum_1 = require("../../common/constants/Status.enum");
const Customer_entity_1 = require("../../entities/Customer.entity");
const EmailLog_1 = require("../../entities/EmailLog");
const InviteEmployerLog_1 = require("../../entities/InviteEmployerLog");
const PasswordHistoryLog_1 = require("../../entities/PasswordHistoryLog");
const WrongUserLog_1 = require("../../entities/WrongUserLog");
const Users_1 = require("../../entities/Users");
const UsersTemp_1 = require("../../entities/UsersTemp");
const UserType_1 = require("../../entities/UserType");
const CompanyUser_1 = require("../../entities/CompanyUser");
const js_utils_1 = require("@rubiin/js-utils");
const jwt = require("jsonwebtoken");
const index_1 = require("../../config/index");
const providers_enum_1 = require("../../common/constants/mapping/providers.enum");
const PermissionUserType_1 = require("../../entities/PermissionUserType");
const helpers_1 = require("../../utils/helpers");
const EmployerSettings_entity_1 = require("../../entities/EmployerSettings.entity");
const typeorm_2 = require("typeorm");
const UserTypeTemp_1 = require("../../entities/UserTypeTemp");
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
const logger = new common_1.Logger('Create Employee Login DB Writer');
let UserOperationService = class UserOperationService {
    constructor(permissionUserTypeRepo, usersTempRepo, inviteEmployerRepo, wrongUserLogRepo, usersRepo, customerRepository, userTypeRepo, userTypeTempRepo, permissionRepo, permissionUserTypeTemp) {
        this.permissionUserTypeRepo = permissionUserTypeRepo;
        this.usersTempRepo = usersTempRepo;
        this.inviteEmployerRepo = inviteEmployerRepo;
        this.wrongUserLogRepo = wrongUserLogRepo;
        this.usersRepo = usersRepo;
        this.customerRepository = customerRepository;
        this.userTypeRepo = userTypeRepo;
        this.userTypeTempRepo = userTypeTempRepo;
        this.permissionRepo = permissionRepo;
        this.permissionUserTypeTemp = permissionUserTypeTemp;
    }
    async wrongUserFound(data) {
        try {
            await helpers_1.sendMailUser('Orbis', 'aaja.baruwal@orbispay.me', 'notify', {
                employer: 'The employee with email ' +
                    data.employee_email +
                    ' has trouble signing in',
            }, 'Alert');
            await this.wrongUserLogRepo.save(Object.assign(Object.assign({}, data), { status: 'PENDING' }));
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async contactMe(data) {
        try {
            const inviteEmployer = new InviteEmployerLog_1.InviteEmployerLog();
            inviteEmployer.employer_email = data.email;
            await this.inviteEmployerRepo.save(inviteEmployer);
            const mailData = {
                email: data.email,
            };
            await helpers_1.sendMailUser('Orbis', 'aaja.baruwal@orbispay.me', 'contact', mailData, 'Employer contact request');
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendUserCreateNotification(data) {
        try {
            await helpers_1.sendMailUser('Orbis', data.email, 'welcome', data.data, 'Welcome to OrbisPay!');
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getAxios() {
        return axios_1.default.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
    }
    async invitemeployerMobile(data) {
        try {
            const inviteEmployer = new InviteEmployerLog_1.InviteEmployerLog();
            inviteEmployer.employee_email = data.employee_email;
            inviteEmployer.employer_email = data.employer_email;
            await helpers_1.sendMailUser('Orbis', 'aaja.baruwal@orbispay.me', 'notify', {
                employer: 'The employee with email ' +
                    data.employee_email +
                    ' has ivited and employer with email ' +
                    data.employer_email,
            }, 'Alert');
            await this.inviteEmployerRepo.save(inviteEmployer);
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setNotification(data) {
        try {
            await this.inviteEmployerRepo.update({ employer_email: data.employer_email }, { notify: data.notify });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(data) {
        try {
            if (data.is_superadmin === true) {
                if (data.user.user_type) {
                    data.user.user_type = await this.userTypeRepo.findOne({
                        idx: data.user.user_type,
                    });
                }
                const idx = data.user.user_type;
                await this.usersRepo.update({ idx }, data.user);
            }
            else {
                await this.usersTempRepo.save(Object.assign({ user: data.userFromActive, created_by: data.created_by, operation: Operations_enum_1.Operations.UPDATE, status: Status_enum_1.Status.PENDING }, data.user));
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createUser(data) {
        let userTypeName;
        let userIdx;
        let serviceBusDto = {};
        let paramData = data;
        const Axios = this.getAxios();
        try {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                const userId = await transactionalEntityManager.save(Users_1.Users, Object.assign(Object.assign({}, paramData.data), { display_id: paramData.employer_no }));
                await transactionalEntityManager.save(CompanyUser_1.CompanyUser, {
                    user: userId,
                });
                userIdx = userId.idx;
                await transactionalEntityManager.update(InviteEmployerLog_1.InviteEmployerLog, { employer_email: paramData.user.email }, { status: 'ONBOARDED' });
                const tokenData = jwt.sign({ data: userId.idx }, index_1.default.jwt.secret, {
                    expiresIn: index_1.default.jwt.access_expiry
                });
                await transactionalEntityManager.save(EmailLog_1.EmailLog, {
                    user: userId.id,
                    email: paramData.user.email,
                    token: tokenData,
                });
                const data = {
                    link: `https://${process.env.SERVER_IP}:4070/set-password?token=${tokenData}`,
                };
                if (userTypeName === 'Default-Employer') {
                    await transactionalEntityManager.save(EmployerSettings_entity_1.EmployerSettings, {
                        created_by: userIdx,
                        auto_invite: false,
                        auto_approve: false,
                    });
                    data.link = `https://${process.env.SERVER_IP}:4071/set-password?token=${tokenData}`;
                    if (paramData.user.employer_no == '11102459') {
                        await Axios.get(`${process.env.PAYCHEX_TIME_ATTENDENCE}/v1/paychex-integration/importCurrMonthTimeAttendance`);
                    }
                }
                data.link = data.link.toString();
                await helpers_1.sendMailUser('Orbis', paramData.user.email, 'welcome', data, 'Welcome to OrbisPay!');
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createAwaitUser(data) {
        try {
            console.log('Data from Create await User --------> ' + JSON.stringify(data));
            await this.usersTempRepo.save(Object.assign({ status: Status_enum_1.Status.PENDING, operation: Operations_enum_1.Operations.CREATE, created_by: data.idx, display_id: data.user.employer_no }, data.user));
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUser(data) {
        try {
            let idx = data.idx;
            if (data.is_superadmin === true) {
                await this.usersRepo.update({ idx }, { is_obsolete: true });
            }
            else {
                await this.usersTempRepo.save(Object.assign(Object.assign({}, data), { operation: Operations_enum_1.Operations.DELETE, created_by: data.idx, status: Status_enum_1.Status.PENDING, user: data.user }));
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyUserOperation(data) {
        const Axios = this.getAxios();
        try {
            if (data.operations === Status_enum_1.Status.REJECTED) {
                if (data.rejection_reason === '') {
                    throw new common_1.HttpException('Rejection reason is required', common_1.HttpStatus.BAD_REQUEST);
                }
                await this.usersTempRepo.update({ idx: data.idx }, {
                    status: Status_enum_1.Status.REJECTED,
                    rejection_reason: data.rejection_reason,
                });
            }
            if (data.status === Operations_enum_1.Operations.CREATE) {
                let tempUser = data.tempUser;
                await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                    const user = await transactionalEntityManager.save(Users_1.Users, {
                        company_name: tempUser.company_name,
                        contact_name: tempUser.contact_name,
                        zip_code: tempUser.zip_code,
                        payroll_system: providers_enum_1.AvailableProviders[`${tempUser.payroll_system}`],
                        user_type: tempUser.user_type,
                        phone_ext: tempUser.phone_ext,
                        phone_number: tempUser.phone_number,
                        display_id: tempUser.display_id,
                        employer_no: tempUser.employer_no,
                        email: tempUser.email,
                        company_internalhr_system: tempUser.company_internalhr_system,
                        time_management_system: tempUser.time_management_system,
                    });
                    await transactionalEntityManager.save(CompanyUser_1.CompanyUser, {
                        user,
                        is_obsolete: false,
                    });
                    await transactionalEntityManager.save(PasswordHistoryLog_1.PasswordHistoryLog, {
                        password: tempUser.password,
                        user_id: user,
                    });
                    const token = jwt.sign({ data: user.idx }, index_1.default.jwt.secret, {
                        expiresIn: index_1.default.jwt.access_expiry
                    });
                    await transactionalEntityManager.save(EmailLog_1.EmailLog, {
                        user: user,
                        email: tempUser.email,
                        token,
                    });
                    const mailData = {
                        link: `https://${process.env.SERVER_IP}:4070/set-password?token=${token}`,
                    };
                    if (tempUser.user_type.user_type === 'Default-Employer') {
                        mailData.link = `https://${process.env.SERVER_IP}:4071/set-password?token=${token}`;
                        if (user.employer_no == '11102459') {
                            await Axios.get(`${process.env.PAYCHEX_TIME_ATTENDENCE}/v1/paychex-integration/importCurrMonthTimeAttendance`);
                        }
                    }
                    await transactionalEntityManager.update(UsersTemp_1.UsersTemp, { idx: data.idx }, { status: Status_enum_1.Status.APPROVED, user });
                    await helpers_1.sendMailUser('Orbis', tempUser.email, 'welcome', mailData, 'Welcome to OrbisPay!');
                });
            }
            if (data.status === Operations_enum_1.Operations.UPDATE) {
                const { user } = data.userResponse;
                await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager
                        .getRepository(UsersTemp_1.UsersTemp)
                        .update({ idx: data.idx }, { status: Status_enum_1.Status.APPROVED });
                    await transactionalEntityManager
                        .getRepository(Users_1.Users)
                        .update({ id: user.id }, js_utils_1.removeEmpty(js_utils_1.omit(data.userResponse, [
                        'idx',
                        'id',
                        'operation',
                        'user',
                        'status',
                        'rejection_reason',
                        'created_by',
                        'is_obsolete',
                        'is_active',
                        'created_on',
                        'modified_on',
                    ])));
                });
            }
            if (data.status === Operations_enum_1.Operations.DELETE) {
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager
                        .getRepository(UsersTemp_1.UsersTemp)
                        .update({ idx: data.idx }, { status: Status_enum_1.Status.APPROVED });
                    await transactionalEntityManager
                        .getRepository(Users_1.Users)
                        .update({ id: data.userResponse.user.id }, { is_obsolete: true });
                });
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async enableDisable(data) {
        try {
            if (data.is_superadmin === true) {
                var idx = data.idx;
                await this.usersRepo.update({ idx }, { is_active: operation === 'ENABLE' });
            }
            else {
                var operation = data.operation;
                const user = data.user;
                const id = Object.assign({}, user);
                await this.usersTempRepo.save(Object.assign(Object.assign({ user: data.id }, user), { status: Status_enum_1.Status.PENDING, operation, created_by: user.idx }));
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setFcm(data) {
        let idx = data.idx;
        let fcm_key = data.fcm_key;
        let platform = data.platform;
        try {
            await this.customerRepository.update({ idx }, { fcm_key, platform });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addorChangeMobileNumber(data) {
        let idx = data.idx;
        let mobile_number = data.mobile_number;
        try {
            await this.customerRepository.update({ idx }, {
                mobile_number: mobile_number,
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async requestSaFeature(data) {
        let idx = data.idx;
        try {
            await this.customerRepository.update({ idx }, { sa_status: 'PENDING', sa_approved: false, sort_order: 1 });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetUser(data) {
        let idx = data.idx;
        try {
            await this.customerRepository.update({ idx: idx }, { is_registered: false });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createUserType(data) {
        try {
            const permission = new PermissionUserType_1.PermissionUserType();
            if (data.createUserTypeTemplate === 'Add') {
                await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager.save(PermissionUserType_1.PermissionUserType, data.permissionBulkAdd);
                });
            }
            else if (data.createUserTypeTemplate === 'Request') {
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    const roleId = await transactionalEntityManager
                        .getRepository(UserTypeTemp_1.UserTypeTemp)
                        .save(data.dto);
                    const id = roleId.id;
                    const incomingPermissions = await typeorm_2.getConnection()
                        .getRepository(Permission_1.Permission)
                        .find({
                        where: { idx: typeorm_2.In(roleId.permission) },
                        select: ['id', 'base_name'],
                    });
                    const permissionBulkAdd = [];
                    for (const element of incomingPermissions) {
                        const permission = new PermissionUserTypeTemp_1.PermissionUserTypeTemp();
                        permission.idx = element.idx;
                        permission.usertype = id;
                        permission.base_name = element.base_name;
                        permission.permission = element;
                        permissionBulkAdd.push(permission);
                    }
                    await transactionalEntityManager
                        .getRepository(PermissionUserTypeTemp_1.PermissionUserTypeTemp)
                        .save(permissionBulkAdd);
                });
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUserType(data) {
        let idx = data.idx;
        try {
            if (data.action === 'update') {
                await this.userTypeRepo.update({ idx }, { is_obsolete: data.is_obsolete });
            }
            else if (data.action === 'save') {
                await this.userTypeTempRepo.save({
                    user_type: data.user_type,
                    description: data.description,
                    status: data.status,
                    operation: data.operation,
                    userType: data.userType,
                    created_by: data.created_by,
                });
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUserTypeName(data) {
        let idx = data.idx;
        try {
            if (data.action === 'update') {
                await this.userTypeRepo.update({ idx }, { user_type: data.user_type, description: data.description });
            }
            else if (data.action === 'save') {
                await this.userTypeTempRepo.save({
                    userType: data.userType,
                    operation: data.operation,
                    status: data.status,
                    user_type: data.user_type,
                    description: data.description,
                    created_by: data.created_by,
                });
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async VerifyUserType(data) {
        try {
            if (data.type === 'rejected') {
                console.log("**************************");
                console.log("entering update");
                await this.userTypeTempRepo.update({ idx: data.idx }, { status: Status_enum_1.Status.REJECTED });
            }
            else if (data.type === 'create') {
                console.log("**************************");
                console.log("entering create");
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    const saveToActiveRole = await transactionalEntityManager
                        .getRepository(UserType_1.UserType)
                        .save(Object.assign({}, js_utils_1.omit(data.tempData, [
                        'idx',
                        'id',
                        'is_obsolete',
                        'is_active',
                        'created_on',
                        'modified_on',
                    ])));
                    const permissionBulkAdd = [];
                    const permissions = await this.permissionUserTypeTemp.find({
                        where: { usertype: data.tempData.id },
                        relations: ['permission'],
                    });
                    for (const element of permissions) {
                        const permission = new PermissionUserType_1.PermissionUserType();
                        permission.userType = saveToActiveRole;
                        permission.permission = element.permission;
                        permission.base_name = element.base_name;
                        permissionBulkAdd.push(permission);
                    }
                    await transactionalEntityManager
                        .getRepository(PermissionUserType_1.PermissionUserType)
                        .save(permissionBulkAdd);
                    await transactionalEntityManager
                        .getRepository(UserTypeTemp_1.UserTypeTemp)
                        .update({ idx: data.idx }, { userType: saveToActiveRole, status: Status_enum_1.Status.APPROVED });
                });
            }
            else if (data.type === 'updateUserType') {
                console.log(data);
                console.log("**************************");
                console.log("entering updateUserType");
                const roleResponse = await this.userTypeTempRepo.findOne({
                    where: { idx: data.idx },
                    relations: ['userType'],
                });
                console.log(roleResponse);
                const { user_type, id } = roleResponse;
                console.log(user_type);
                console.log(id);
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager
                        .getRepository(UserTypeTemp_1.UserTypeTemp)
                        .update({ idx: data.idx }, { status: Status_enum_1.Status.APPROVED });
                    await transactionalEntityManager
                        .getRepository(UserType_1.UserType)
                        .update({ id: id }, { user_type });
                });
            }
            else if (data.type === 'updateUserTypePermission') {
                console.log("**************************");
                console.log("entering updateUserTypePermission");
                const userType = data.userType;
                const tempData = data.tempData;
                const id = data.id;
                const idxVal = data.idxVal;
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager
                        .getRepository(PermissionUserType_1.PermissionUserType)
                        .delete({ userType });
                    await transactionalEntityManager
                        .getRepository(UserType_1.UserType)
                        .update({ idx: userType.idx }, { description: tempData.description });
                    const permissionBulkAdd = [];
                    const permissions = await this.permissionUserTypeRepo.find({
                        where: { userType: id },
                        relations: ['permission'],
                    });
                    for (const element of permissions) {
                        const permission = new PermissionUserType_1.PermissionUserType();
                        permission.userType = userType;
                        permission.base_name = element.base_name;
                        permission.permission = element.permission;
                        permissionBulkAdd.push(permission);
                    }
                    await transactionalEntityManager
                        .getRepository(PermissionUserType_1.PermissionUserType)
                        .save(permissionBulkAdd);
                    await transactionalEntityManager
                        .getRepository(UserTypeTemp_1.UserTypeTemp)
                        .update({ idx: idxVal }, { userType, status: Status_enum_1.Status.APPROVED });
                });
            }
            else if (data.type === 'delete') {
                console.log("**************************");
                console.log("entering delete");
                const idxVal = data.idxVal;
                const id = data.id;
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager
                        .getRepository(UserTypeTemp_1.UserTypeTemp)
                        .update({ idx: idxVal }, { status: Status_enum_1.Status.APPROVED });
                    await transactionalEntityManager
                        .getRepository(UserType_1.UserType)
                        .update({ id: id }, { is_obsolete: true });
                });
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUserTypePermissions(data) {
        const idx = data.idx;
        try {
            if (data.type === 'superadmin') {
                const checkUserTypeExists = data.checkUserTypeExists;
                const incomingPermissions = data.incomingPermissions;
                const userType = data.userType;
                await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager.delete(PermissionUserType_1.PermissionUserType, {
                        userType: checkUserTypeExists,
                    });
                    const permissionBulkAdd = [];
                    for (const element of incomingPermissions) {
                        const permission = new PermissionUserType_1.PermissionUserType();
                        permission.idx = element.idx;
                        permission.userType = checkUserTypeExists;
                        permission.base_name = element.base_name;
                        permission.permission = element;
                        permissionBulkAdd.push(permission);
                    }
                    await transactionalEntityManager.save(permissionBulkAdd);
                    await transactionalEntityManager.update(UserType_1.UserType, { idx }, { description: userType.description });
                });
            }
            else {
                const userTypeTempRes = await this.userTypeTempRepo.save({
                    user_type: data.user_type,
                    userType: data.userType,
                    operation: data.operation,
                    status: data.status,
                    description: data.description,
                    created_by: data.created_by,
                });
                if (data.incomingPermissions.length > 0) {
                    const permissionBulkAdd = [];
                    for (const element of data.incomingPermissions) {
                        const permission = new PermissionUserTypeTemp_1.PermissionUserTypeTemp();
                        permission.usertype = userTypeTempRes;
                        permission.permission = element;
                        permission.base_name = element.base_name;
                        permissionBulkAdd.push(permission);
                    }
                    await this.permissionUserTypeTemp.save(permissionBulkAdd);
                }
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
UserOperationService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(PermissionUserType_1.PermissionUserType)),
    __param(1, typeorm_1.InjectRepository(UsersTemp_1.UsersTemp)),
    __param(2, typeorm_1.InjectRepository(InviteEmployerLog_1.InviteEmployerLog)),
    __param(3, typeorm_1.InjectRepository(WrongUserLog_1.WrongUserLog)),
    __param(4, typeorm_1.InjectRepository(Users_1.Users)),
    __param(5, typeorm_1.InjectRepository(Customer_entity_1.Customer)),
    __param(6, typeorm_1.InjectRepository(UserType_1.UserType)),
    __param(7, typeorm_1.InjectRepository(UserTypeTemp_1.UserTypeTemp)),
    __param(8, typeorm_1.InjectRepository(Permission_1.Permission)),
    __param(9, typeorm_1.InjectRepository(PermissionUserTypeTemp_1.PermissionUserTypeTemp)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserOperationService);
exports.UserOperationService = UserOperationService;
//# sourceMappingURL=user-operation.service.js.map