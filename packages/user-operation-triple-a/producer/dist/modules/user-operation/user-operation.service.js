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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperationService = void 0;
const EmailLog_1 = require("../../entities/EmailLog");
const Permission_1 = require("../../entities/Permission");
const Protocol_1 = require("../../entities/Protocol");
const Users_1 = require("../../entities/Users");
const UsersTemp_1 = require("../../entities/UsersTemp");
const UserType_1 = require("../../entities/UserType");
const Customer_entity_1 = require("../../entities/Customer.entity");
const WorkLog_entity_1 = require("../../entities/WorkLog.entity");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const Status_enum_1 = require("../../common/constants/Status.enum");
const wronguser_dto_1 = require("../../dtos/wronguser.dto");
const WrongUserLog_1 = require("../../entities/WrongUserLog");
const InviteEmployerLog_1 = require("../../entities/InviteEmployerLog");
const Derived_dto_2 = require("../../dtos/Derived.dto");
const Notify_dto_1 = require("../../dtos/Notify.dto");
const UpdateUser_dto_1 = require("../../dtos/UpdateUser.dto");
const CreateUser_dto_1 = require("../../dtos/CreateUser.dto");
const js_utils_1 = require("@rubiin/js-utils");
const operations_enum_1 = require("../../common/constants/operations.enum");
const paycycle_1 = require("../../common/constants/paycycle");
const UserTypeTemp_1 = require("../../entities/UserTypeTemp");
const class_transformer_1 = require("class-transformer");
const CreateUserType_dto_1 = require("../../dtos/CreateUserType.dto");
const PermissionUserType_1 = require("../../entities/PermissionUserType");
const UpdateUserTypeName_dto_1 = require("../../dtos/UpdateUserTypeName.dto");
const PermissionUserTypeTemp_1 = require("../../entities/PermissionUserTypeTemp");
const UpdateUserTypePermission_dto_1 = require("../../dtos/UpdateUserTypePermission.dto");
const common_1 = require("@nestjs/common");
const helpers_1 = require("../../utils/helpers");
const jwt = require("jsonwebtoken");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const response_interface_1 = require("../../common/interfaces/response.interface");
const ListQuery_dto_1 = require("../../dtos/ListQuery.dto");
const index_1 = require("../../config/index");
const date_fns_1 = require("date-fns");
const Derived_dto_3 = require("../../dtos/Derived.dto");
const service_bus_sender_service_1 = require("../service-bus-sender/service-bus-sender.service");
const AppproverReject_dto_1 = require("../../dtos/AppproverReject.dto");
const typeorm_config_1 = require("../../typeorm.config");
const CompanyUser_1 = require("../../entities/CompanyUser");
const EmployerSettings_entity_1 = require("../../entities/EmployerSettings.entity");
const connectionString = index_1.default.sbSenderConnectionString;
const maxRetries = index_1.default.sbSenderMaxRetries;
const REQUEST_APPROVE_SUCCESS_MSG = 'Request Approved Successfully';
const topicName = index_1.default.topicName;
const queueName = index_1.default.queueName;
let UserOperationService = class UserOperationService {
    constructor(permissionRepo, permissionUserTypeRepo, permissionUserTypeTemp, serviceBusService, usersRepo, wrongUserLogRepo, inviteEmployerRepo, usersTempRepo, userTypeRepo, customerRepository, workLogRepo, userTypeTempRepo, companyUserRepo) {
        this.permissionRepo = permissionRepo;
        this.permissionUserTypeRepo = permissionUserTypeRepo;
        this.permissionUserTypeTemp = permissionUserTypeTemp;
        this.serviceBusService = serviceBusService;
        this.usersRepo = usersRepo;
        this.wrongUserLogRepo = wrongUserLogRepo;
        this.inviteEmployerRepo = inviteEmployerRepo;
        this.usersTempRepo = usersTempRepo;
        this.userTypeRepo = userTypeRepo;
        this.customerRepository = customerRepository;
        this.workLogRepo = workLogRepo;
        this.userTypeTempRepo = userTypeTempRepo;
        this.companyUserRepo = companyUserRepo;
    }
    async getEmployerByName(query) {
        let data = await typeorm_2.getConnection()
            .getRepository(Users_1.Users)
            .createQueryBuilder('Users')
            .select(['Users.idx', 'Users.company_name'])
            .where(`Users.company_name LIKE UPPER(:search) and Users.user_type = 1 `, { search: `${query.toUpperCase()}%` })
            .getMany();
        return { data };
    }
    async getEmployerByZip(query) {
        let data = await typeorm_2.getConnection()
            .getRepository(Users_1.Users)
            .createQueryBuilder('Users')
            .select([
            'Users.idx',
            'Users.contact_name',
            'Users.zip_code',
            'Users.company_name',
        ])
            .where(`Users.zip_code = :search`, { search: `${query}` })
            .getMany();
        return { data };
    }
    async wrongUserFound(wrongUser) {
        const reqExists = await this.wrongUserLogRepo.findOne({
            where: {
                employee_id: wrongUser.employee_id,
                ssn_no: wrongUser.ssn_no,
                employer_id: wrongUser.employer_id,
                status: 'PENDING',
            },
        });
        if (reqExists) {
            throw new common_1.HttpException('Request already exists, Please wait', common_1.HttpStatus.CONFLICT);
        }
        const serviceBusBodyDto = {
            employee_email: wrongUser.employee_email,
        };
        const serviceBusDto = {
            serviceType: 'wrong-user-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Your details have been sent to orbis' };
    }
    async getUserByIdx(idx) {
        let res = await this.usersRepo.findOne({
            relations: ['user_type'],
            where: { idx, is_obsolete: false, is_superadmin: false },
        });
        if (!res) {
            throw new common_1.HttpException('User with given idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        return res;
    }
    async contactMe(employer_email) {
        const checkForEmployer = await this.inviteEmployerRepo.findOne({
            where: {
                employer_email: employer_email,
                status: 'INVITED',
                is_active: true,
            },
        });
        if (checkForEmployer) {
            throw new common_1.HttpException('Request for employer  already exists', common_1.HttpStatus.CONFLICT);
        }
        const serviceBusBodyDto = {
            email: employer_email,
        };
        const serviceBusDto = {
            serviceType: 'contact-me-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'The operation was successful' };
    }
    async inviteEmployerMobile(inviteDto) {
        const checkForEMployerInvites = await this.inviteEmployerRepo.findOne({
            where: {
                employer_email: inviteDto.employer_email,
                status: 'INVITED',
                is_active: true,
            },
        });
        if (checkForEMployerInvites) {
            throw new common_1.HttpException('Invite for employer with invite already exists', common_1.HttpStatus.CONFLICT);
        }
        const serviceBusBodyDto = {
            employee_email: inviteDto.employee_email,
            employer_email: inviteDto.employer_email
        };
        const serviceBusDto = {
            serviceType: 'invite-employer-mobile-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'The operation was successful' };
    }
    async setNotification(inviteDto) {
        const checkExists = await this.inviteEmployerRepo.findOne({
            where: {
                employer_email: inviteDto.employer_email,
                is_obsolete: false,
            },
        });
        if (!checkExists) {
            throw new common_1.HttpException('Invite for employer with email does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        const serviceBusBodyDto = {
            employer_email: inviteDto.employer_email,
            notify: inviteDto.notify
        };
        const serviceBusDto = {
            serviceType: 'set-notification-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 201, message: 'The operation was successful' };
    }
    async getAllUsers(listQuery) {
        const { limit, search, page, user_type, status } = listQuery;
        const offset = limit * (page - 1);
        const query = typeorm_2.getConnection()
            .getRepository(Users_1.Users)
            .createQueryBuilder('Users')
            .where('Users.is_obsolete = :is_obsolete', {
            is_obsolete: false,
        })
            .andWhere('Users.is_superadmin = :is_superadmin', {
            is_superadmin: false,
        })
            .leftJoinAndSelect('Users.user_type', 'user_type');
        if (status !== '') {
            query.andWhere('Users.is_active = :status', {
                status: status.toLowerCase() === 'active',
            });
        }
        if (user_type !== '') {
            query.andWhere('user_type.user_type = :user_type', { user_type });
        }
        if (search !== '') {
            query.andWhere(new typeorm_2.Brackets(qb => {
                qb.where(`Users.contact_name LIKE UPPER(:search) OR Users.email LIKE UPPER(:search) OR Users.username LIKE UPPER(:search) OR Users.employer_no LIKE UPPER(:search)`, { search: `${search.toUpperCase()}%` });
            }));
        }
        const [result, total] = await query
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        const pages = Math.ceil(total / limit);
        const host = helpers_1.getHost();
        return helpers_1.paginate(pages, page, total, host, result);
    }
    async getAllPendingUsers(listQuery, userRequesting) {
        const { limit, search, page, request_type } = listQuery;
        const offset = limit * (page - 1);
        const query = typeorm_2.getConnection()
            .getRepository(UsersTemp_1.UsersTemp)
            .createQueryBuilder('UsersTemp')
            .where('UsersTemp.status = :status', {
            status: Status_enum_1.Status.PENDING,
        })
            .andWhere('UsersTemp.is_obsolete = :is_obsolete', {
            is_obsolete: false,
        })
            .leftJoinAndSelect('UsersTemp.user_type', 'user_type');
        if (request_type === 'by') {
            query.andWhere('UsersTemp.created_by = :idx', {
                idx: userRequesting.idx,
            });
        }
        if (request_type === 'to') {
            query.andWhere('UsersTemp.created_by != :idx', {
                idx: userRequesting.idx,
            });
        }
        if (search !== '') {
            query.andWhere(new typeorm_2.Brackets(qb => {
                qb.where(`UsersTemp.company_name LIKE UPPER(:search) OR UsersTemp.email LIKE UPPER(:search)`, { search: `${search.toUpperCase()}%` });
            }));
        }
        const [result, total] = await query
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        const pages = Math.ceil(total / limit);
        const host = helpers_1.getHost();
        return helpers_1.paginate(pages, page, total, host, result);
    }
    async getAPendingUser(idx) {
        let res = await this.usersTempRepo.findOne({
            where: { idx, is_obsolete: false, status: Status_enum_1.Status.PENDING },
            join: {
                alias: 'users',
                leftJoinAndSelect: {
                    user_type: 'users.user_type',
                    user: 'users.user',
                    old_user_type: 'user.user_type',
                },
            },
        });
        if (!res) {
            throw new common_1.HttpException('Customer with Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        return res;
    }
    async updateUser(user, idx, userRequesting) {
        const userExists = await this.usersRepo.findOne({
            idx,
            is_obsolete: false,
        });
        if (!userExists) {
            throw new common_1.HttpException('User with given Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        const userExistsInTemp = await this.usersTempRepo.findOne({
            user: userExists,
            status: 'PENDING',
            is_obsolete: false,
        });
        if (userExistsInTemp) {
            throw new common_1.HttpException('Request for user already exists', common_1.HttpStatus.CONFLICT);
        }
        if (userRequesting.is_superadmin === true) {
            if (user.user_type) {
                user.user_type = await this.userTypeRepo.findOne({
                    idx: user.user_type,
                });
            }
            const serviceBusBodyDto = {
                user: user,
                is_superadmin: true
            };
            const serviceBusDto = {
                serviceType: 'update-user-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'User updated' };
        }
        const userFromActive = await this.usersRepo.findOne({ idx });
        if (user.user_type) {
            user.user_type = await this.userTypeRepo.findOne({ idx: user.user_type });
        }
        const serviceBusBodyDto = {
            user: user,
            userFromActive: userFromActive,
            created_by: userRequesting.idx,
            operation: operations_enum_1.Operations.UPDATE,
            status: Status_enum_1.Status.PENDING,
            is_superadmin: false
        };
        const serviceBusDto = {
            serviceType: 'update-user-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
    async createUser(user, userRequesting) {
        let userTypeName;
        let userIdx;
        const userExists = await this.usersRepo.findOne({
            email: user.email,
            is_obsolete: false,
        });
        if (userExists) {
            throw new common_1.HttpException('Employer with given email already exists', common_1.HttpStatus.CONFLICT);
        }
        const userTempExists = await this.usersTempRepo.findOne({
            email: user.email,
            status: 'PENDING',
            is_obsolete: false,
        });
        if (userTempExists) {
            throw new common_1.HttpException('Request with given email already exists', common_1.HttpStatus.CONFLICT);
        }
        if (user.user_type) {
            const userTypeexists = await this.userTypeRepo.findOne({
                idx: user.user_type,
            });
            if (!userTypeexists) {
                throw new common_1.HttpException('User type does not exists', common_1.HttpStatus.NOT_FOUND);
            }
            user.user_type = userTypeexists;
            userTypeName = userTypeexists.user_type;
        }
        if (!user.employer_no) {
            user.employer_no = new Date().toISOString();
        }
        if (userRequesting.is_superadmin === true) {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                const userId = await transactionalEntityManager.save(Users_1.Users, Object.assign(Object.assign({}, user), { display_id: user.employer_no }));
                await transactionalEntityManager.save(CompanyUser_1.CompanyUser, {
                    user: userId,
                });
                userIdx = userId.idx;
                await transactionalEntityManager.update(InviteEmployerLog_1.InviteEmployerLog, { employer_email: user.email }, { status: 'ONBOARDED' });
                const tokenData = jwt.sign({ data: userId.idx }, index_1.default.jwt.secret, {
                    expiresIn: 300,
                });
                await transactionalEntityManager.save(EmailLog_1.EmailLog, {
                    user: userId.id,
                    email: user.email,
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
                    if (user.employer_no == '11102459') {
                        await helpers_1.Axios.get(`${process.env.PAYCHEX_TIME_ATTENDENCE}/v1/paychex-integration/importCurrMonthTimeAttendance`);
                    }
                }
                data.link = data.link.toString();
                const serviceBusBodyDto = {
                    email: user.email,
                    data: data
                };
                const serviceBusDto = {
                    serviceType: 'user-create-notify-user-operation',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            });
            return { statusCode: 200, message: 'User created', data: { userIdx } };
        }
        await this.usersTempRepo.save(Object.assign({ status: Status_enum_1.Status.PENDING, operation: operations_enum_1.Operations.CREATE, created_by: userRequesting.idx, display_id: user.employer_no }, user));
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
    async deleteUser(idx, userRequesting) {
        const userExists = await this.usersRepo.findOne({
            where: { idx, is_active: true },
            relations: ['user_type'],
        });
        if (!userExists) {
            throw new common_1.HttpException('User with given Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        const userExistsInTemp = await this.usersTempRepo.findOne({
            user: userExists,
            status: 'PENDING',
            is_obsolete: false,
        });
        if (userExistsInTemp) {
            throw new common_1.HttpException('Request for user already exists', common_1.HttpStatus.CONFLICT);
        }
        if (userRequesting.is_superadmin === true) {
            const serviceBusBodyDto = {
                idx: idx,
                is_superadmin: true
            };
            const serviceBusDto = {
                serviceType: 'delete-user-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'User deleted' };
        }
        const data = js_utils_1.omit(userExists, [
            'id',
            'idx',
            'modified_on',
            'created_on',
            'is_obsolete',
            'is_active',
        ]);
        const serviceBusBodyDto = {
            data: data,
            operation: operations_enum_1.Operations.DELETE,
            created_by: userRequesting.idx,
            status: Status_enum_1.Status.PENDING,
            user: userExists,
            is_superadmin: false
        };
        const serviceBusDto = {
            serviceType: 'delete-user-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
    async verifyUserOperation(approveRejectDto, idxVal, userRequesting) {
        const tempUser = await this.usersTempRepo.findOne({
            where: {
                idx: idxVal,
            },
            relations: ['user_type'],
        });
        if (!tempUser) {
            throw new common_1.HttpException('No user verification with the given idx', common_1.HttpStatus.NOT_FOUND);
        }
        if (tempUser.status === 'APPROVED' || tempUser.status === 'REJECTED') {
            throw new common_1.HttpException('Request already processed', common_1.HttpStatus.BAD_REQUEST);
        }
        if (tempUser.created_by === userRequesting.idx &&
            userRequesting.is_superadmin !== true) {
            throw new common_1.HttpException('Cannot verify own request', common_1.HttpStatus.BAD_REQUEST);
        }
        if (approveRejectDto.status === operations_enum_1.Operations.REJECTED) {
            if (approveRejectDto.rejection_reason === '') {
                throw new common_1.HttpException('Rejection reason is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const serviceBusBodyDto = {
                status: operations_enum_1.Operations.REJECTED,
                rejection_reason: approveRejectDto.rejection_reason,
                idx: idxVal
            };
            const serviceBusDto = {
                serviceType: 'verify-user-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Rejected' };
        }
        const { operation } = tempUser;
        if (operation === operations_enum_1.Operations.CREATE) {
            const serviceBusBodyDto = {
                status: operations_enum_1.Operations.CREATE,
                tempUser: tempUser,
                idx: idxVal
            };
            const serviceBusDto = {
                serviceType: 'verify-user-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
        if (operation === operations_enum_1.Operations.UPDATE) {
            const userResponse = await this.usersTempRepo.findOne({
                where: { idx: idxVal },
                relations: ['user_type', 'user'],
            });
            const serviceBusBodyDto = {
                status: operations_enum_1.Operations.UPDATE,
                userResponse: userResponse,
                idx: idxVal
            };
            const serviceBusDto = {
                serviceType: 'verify-user-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
        if (operation === operations_enum_1.Operations.DELETE) {
            const userResponse = await this.usersTempRepo.findOne({
                where: { idx: idxVal },
                relations: ['user'],
            });
            const serviceBusBodyDto = {
                status: operations_enum_1.Operations.DELETE,
                userResponse: userResponse,
                idx: idxVal
            };
            const serviceBusDto = {
                serviceType: 'verify-user-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
    }
    async enableDisable(operation, idx, userRequesting) {
        const user = await this.usersRepo.findOne({
            where: {
                idx,
                is_obsolete: false,
            },
            relations: ['user_type'],
        });
        if (!user) {
            throw new common_1.HttpException('No user with the given idx', common_1.HttpStatus.NOT_FOUND);
        }
        const userExistsInTemp = await this.usersTempRepo.findOne({
            user: user,
            status: 'PENDING',
            is_obsolete: false,
        });
        if (userExistsInTemp) {
            throw new common_1.HttpException('Request for user already exists', common_1.HttpStatus.CONFLICT);
        }
        if (!user.is_active && operation === 'DISABLE') {
            throw new common_1.HttpException('User already disabled', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.is_active && operation === 'ENABLE') {
            throw new common_1.HttpException('User already enabled', common_1.HttpStatus.BAD_REQUEST);
        }
        if (userRequesting.is_superadmin === true) {
            const serviceBusBodyDto = {
                idx: idx,
                is_superadmin: true
            };
            const serviceBusDto = {
                serviceType: 'enable-disable-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return {
                statusCode: 200,
                message: `The user was ${operation.toLowerCase()}d`,
            };
        }
        const id = Object.assign({}, user);
        const serviceBusBodyDto = {
            status: Status_enum_1.Status.PENDING,
            id: id,
            user: user,
            operation: operation,
            is_superadmin: false
        };
        const serviceBusDto = {
            serviceType: 'enable-disable-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return {
            statusCode: 200,
            message: `Request awaiting approval`,
        };
    }
    async calculateWage(idx, employer_id) {
        const customer = await this.customerRepository.findOne({
            where: {
                idx,
                is_obsolete: false,
                is_active: true,
            },
        });
        if (!customer) {
            throw new common_1.HttpException('No customer found with the idx', common_1.HttpStatus.NOT_FOUND);
        }
        let response = null;
        try {
            response = await helpers_1.Axios.get(`${process.env.GET_EMPLOYER_POLICY}${employer_id}/sa-policy/detail/`);
        }
        catch (e) {
            console.warn(e);
            throw new common_1.HttpException(e.response.data, e.response.status);
        }
        const { startCycleDate: startDate, endCycleDate: endDate, } = await helpers_1.determinePayCycleDateRange(customer.pay_frequency, customer.employer_id);
        const workLog = await this.workLogRepo.find({
            where: {
                user: customer,
                created_on: typeorm_2.Between(date_fns_1.startOfDay(new Date(startDate)).toISOString(), date_fns_1.endOfDay(new Date(endDate)).toISOString()),
            },
        });
        let totalWorkingdays = date_fns_1.differenceInDays(new Date(endDate), new Date(startDate)) + 1;
        if (customer.pay_frequency === 'BI_WEEKLY') {
            totalWorkingdays = 10;
        }
        if (workLog.length === 0) {
            return {
                totalEarnedAmount: 0,
                available: 0,
                workedDays: 0,
                hoursWorked: customer.salary_type === paycycle_1.SalaryType.HOURLY ? 0 : undefined,
                salary_type: customer.salary_type,
                totalWorkingdays,
            };
        }
        let totalHours = 0;
        for (const el of workLog) {
            totalHours += el.hours_worked;
        }
        let days = workLog.length;
        if (customer.pay_frequency === 'BI_WEEKLY') {
            if (workLog.length > 5 && workLog.length < 9) {
                days = workLog.length - 3;
            }
            else if (workLog.length >= 9) {
                days = 5 + (workLog.length - 8);
                if (days > 10) {
                    days = 10;
                }
            }
        }
        let totalEarnedAmount = 0.0;
        if (customer.salary_type === paycycle_1.SalaryType.HOURLY) {
            workLog.map(log => {
                totalEarnedAmount =
                    totalEarnedAmount +
                        parseFloat(log.pay_rate) * parseFloat(log.pay_rate);
            });
        }
        else {
            workLog.map(log => {
                const grossDailyPay = helpers_1.calculateGrossDailyPay(parseFloat(log.pay_rate), customer.pay_frequency);
                totalEarnedAmount = totalEarnedAmount + grossDailyPay;
            });
        }
        const available = totalEarnedAmount *
            parseFloat(response.data.max_percent_of_salary) *
            0.01;
        return {
            totalEarnedAmount,
            available,
            hoursWorked: customer.salary_type === paycycle_1.SalaryType.HOURLY
                ? totalHours
                : undefined,
            workedDays: workLog.length,
            salary_type: customer.salary_type,
            totalWorkingdays,
        };
    }
    async employeeStatus(idx) {
        const customer = await this.customerRepository.findOne({
            where: {
                idx,
                is_obsolete: false,
            },
        });
        if (!customer) {
            throw new common_1.HttpException('No customer found with the idx', common_1.HttpStatus.NOT_FOUND);
        }
        const is_mobile_set = customer.mobile_number === null || customer.mobile_number === ''
            ? false
            : true;
        return {
            sa_status: customer.sa_status,
            is_bank_set: customer.is_bank_set,
            is_mobile_set,
            is_debitcard: customer.is_debitcard,
            mobile_number: customer.mobile_number,
            is_mpin_set: customer.is_mpin_set,
        };
    }
    async hoursWorked(employee) {
        let response = null;
        try {
            response = await helpers_1.Axios.get(`${process.env.GET_EMPLOYER_POLICY}${employee.employer_id}/sa-policy/detail/`);
        }
        catch (e) {
            if (e.response) {
                throw new common_1.HttpException(e.response.data, e.response.status);
            }
        }
        const workLog = await this.workLogRepo.find({
            where: {
                user: employee,
                created_on: typeorm_2.Between(date_fns_1.startOfDay(new Date(response.data.pay_cycle_start_on)).toISOString(), date_fns_1.endOfDay(new Date(response.data.pay_cycle_end_on)).toISOString()),
            },
        });
        if (workLog.length === 0 &&
            employee.salary_type === paycycle_1.SalaryType.SALARIED) {
            return { totalWorked: 0, unit: 'days' };
        }
        if (workLog.length === 0 &&
            employee.salary_type === paycycle_1.SalaryType.HOURLY) {
            return { totalWorked: '0 hours', unit: 'hours' };
        }
        if (employee.salary_type === paycycle_1.SalaryType.SALARIED) {
            return { totalWorked: workLog.length, unit: 'days' };
        }
        let totalHours = 0;
        for (const el of workLog) {
            totalHours += el.hours_worked;
        }
        return { totalWorked: totalHours, unit: 'hours' };
    }
    async idEmployee(idEmployee) {
        const employee = await typeorm_2.getConnection()
            .createQueryBuilder(Customer_entity_1.Customer, 'Customer')
            .where(`	employee_id = :employee_id AND employer_id = :employer_id AND ssn_no LIKE :ssn_no `, {
            employee_id: idEmployee.employee_id,
            employer_id: idEmployee.employer_id,
            ssn_no: `%${idEmployee.ssn_no}`,
        })
            .getOne();
        if (!employee) {
            throw new common_1.HttpException(`We have not found any records that match your details. Please get in touch with your employer and try to confirm your employee number.\n\nYou can also try and find this in your payslip.`, common_1.HttpStatus.NOT_FOUND);
        }
        let contact_name = `${employee.first_name} ${employee.middle_name} ${employee.last_name}`;
        if (employee.middle_name || employee.middle_name !== ' ') {
            contact_name = `${employee.first_name} ${employee.last_name}`;
        }
        return {
            statusCode: 201,
            data: {
                contact_name,
                idx: employee.idx,
                id: employee.employee_id,
                is_registered: employee.is_registered,
            },
        };
    }
    async checkEmail(emailDto) {
        const checkEmailExists = await this.customerRepository.findOne({
            where: {
                email: emailDto.email,
                is_registered: true,
                is_obsolete: false,
            },
        });
        if (checkEmailExists) {
            throw new common_1.HttpException('Employee with email already registered', common_1.HttpStatus.CONFLICT);
        }
        return {
            statusCode: 200,
            message: 'Email looks good',
        };
    }
    async getAllCustomerByIdx(idx) {
        let res = await this.customerRepository.findOne({
            where: { idx, is_obsolete: false },
            relations: ['plaid_infos', 'card_infos'],
        });
        if (!res) {
            throw new common_1.HttpException('Employee with Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        return res;
    }
    async setFcm(idx, fcm_key, platform) {
        const serviceBusBodyDto = {
            idx: idx,
            fcm_key: fcm_key,
            platform: platform
        };
        const serviceBusDto = {
            serviceType: 'set-fcm-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 201, message: 'Operation successful' };
    }
    async requestSaFeature(idx) {
        const customer = await this.customerRepository.findOne({
            where: {
                idx,
            },
        });
        if (!customer) {
            throw new common_1.HttpException('Customer with Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        const serviceBusBodyDto = {
            idx: idx
        };
        const serviceBusDto = {
            serviceType: 'request-sa-feature-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return {
            statusCode: 200,
            message: 'Your request has been sent. Once your company approves you’ll be able to request advances',
        };
    }
    async addorChangeMobileNumber(idx, addOrChangeNumber, operation) {
        const checkNumber = await this.customerRepository.findOne({
            where: {
                mobile_number: addOrChangeNumber.mobile_number,
                is_active: true,
                is_obsolete: false,
            },
        });
        if (checkNumber) {
            throw new common_1.HttpException('Mobile number already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        const serviceBusBodyDto = {
            idx: idx,
            mobile_number: addOrChangeNumber.mobile_number
        };
        const serviceBusDto = {
            serviceType: 'add-change-mobile-number-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return {
            statusCode: 201,
            message: `The phone number was ${operation === 'ADD_NUMBER' ? 'added' : 'changed'}`,
        };
    }
    async resetUser(employee) {
        const serviceBusBodyDto = {
            idx: employee.idx,
        };
        const serviceBusDto = {
            serviceType: 'reset-user-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Operation successful' };
    }
    async getAllUserType(listUserType) {
        const { limit, search, page } = listUserType;
        const offset = limit * (page - 1);
        const query = typeorm_2.getConnection()
            .getRepository(UserType_1.UserType)
            .createQueryBuilder('UserType')
            .where('UserType.is_active = :active', {
            active: true,
        })
            .andWhere('UserType.is_obsolete = :is_obsolete', {
            is_obsolete: false,
        })
            .leftJoinAndSelect('UserType.permissionsUserType', 'permissions');
        if (search !== '') {
            query.andWhere(new typeorm_2.Brackets(qb => {
                qb.where(`UserType.user_type LIKE UPPER(:search)`, {
                    search: `${search.toUpperCase()}%`,
                });
            }));
        }
        const [result, total] = await query
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        const pages = Math.ceil(total / limit);
        const host = helpers_1.getHost();
        return helpers_1.paginate(pages, page, total, host, result);
    }
    async getAllPendingUserType(listpendingDto, userRequesting) {
        const { limit, page, request_type, search } = listpendingDto;
        const offset = limit * (page - 1);
        const query = typeorm_2.getConnection()
            .getRepository(UserTypeTemp_1.UserTypeTemp)
            .createQueryBuilder('UserTypeTemp')
            .where('UserTypeTemp.status = :status', {
            status: Status_enum_1.Status.PENDING,
        })
            .andWhere('UserTypeTemp.is_obsolete = :is_obsolete', {
            is_obsolete: false,
        });
        if (request_type === 'by') {
            query.andWhere('UserTypeTemp.created_by = :idx', {
                idx: userRequesting.idx,
            });
        }
        if (request_type === 'to') {
            query.andWhere('UserTypeTemp.created_by != :idx', {
                idx: userRequesting.idx,
            });
        }
        if (search !== '') {
            query.andWhere(new typeorm_2.Brackets(qb => {
                qb.where(`UserTypeTemp.user_type LIKE UPPER(:search)`, {
                    search: `${search.toUpperCase()}%`,
                });
            }));
        }
        const [result, total] = await query
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        const pages = Math.ceil(total / limit);
        const host = helpers_1.getHost();
        return helpers_1.paginate(pages, page, total, host, result);
    }
    async getPendingUserTypeByIdx(idx) {
        var _a;
        const userTypeFromTemp = await this.userTypeTempRepo.findOne({
            where: { idx, is_obsolete: false, status: Status_enum_1.Status.PENDING },
            relations: ['permissionUserTypeTemps', 'userType'],
        });
        console.info(userTypeFromTemp);
        if (!userTypeFromTemp) {
            throw new common_1.HttpException('UserType with Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        const userType = await this.userTypeRepo.findOne({
            where: {
                id: (_a = userTypeFromTemp === null || userTypeFromTemp === void 0 ? void 0 : userTypeFromTemp.userType) === null || _a === void 0 ? void 0 : _a.id,
            },
            relations: ['permissionsUserType'],
        });
        return {
            new_userType: class_transformer_1.classToPlain(userTypeFromTemp),
            current_userType: class_transformer_1.classToPlain(userType),
        };
    }
    async getAUserType(idx) {
        const checkUserTypeExists = await this.userTypeRepo.findOne({ idx, is_obsolete: false }, {
            select: ['id', 'idx', 'created_on', 'user_type', 'is_active'],
        });
        if (!checkUserTypeExists) {
            throw new common_1.HttpException('User type not found', common_1.HttpStatus.NOT_FOUND);
        }
        const permission = await typeorm_2.getConnection().query(`select dbo."Permission".idx, dbo."Permission".base_name,dbo."Permission".url,dbo."Permission".method from dbo."Permission" join dbo."PermissionUserType" on "Permission".id = "PermissionUserType".permission_id where "PermissionUserType".user_type = @0`, [checkUserTypeExists.id]);
        return Object.assign(Object.assign({}, js_utils_1.omit(checkUserTypeExists, ['id'])), { permission });
    }
    async createUsertype(dto, userRequesting) {
        const userTypeExists = await this.userTypeRepo.findOne({
            user_type: dto.user_type,
            is_obsolete: false,
        });
        if (userTypeExists) {
            throw new common_1.HttpException('User type with given name already exists', common_1.HttpStatus.CONFLICT);
        }
        const incomingPermissions = await this.permissionRepo.find({
            where: { idx: typeorm_2.In(dto.permission) },
            select: ['id', 'base_name'],
        });
        if (userRequesting.is_superadmin === true) {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                const userType = new UserType_1.UserType(dto.user_type, dto.description);
                const userId = await transactionalEntityManager.save(UserType_1.UserType, userType);
                const permissionBulkAdd = [];
                for (const element of incomingPermissions) {
                    const permission = new PermissionUserType_1.PermissionUserType();
                    permission.idx = element.idx;
                    permission.userType = userId;
                    permission.base_name = element.base_name;
                    permission.permission = element;
                    permissionBulkAdd.push(permission);
                }
                const serviceBusBodyDto = {
                    permissionBulkAdd: permissionBulkAdd,
                    createUserTypeTemplate: "Add"
                };
                const serviceBusDto = {
                    serviceType: 'create-usertype-user-operation',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            });
            return { statusCode: 200, message: 'User type Added' };
        }
        dto.operation = operations_enum_1.Operations.CREATE;
        dto.created_by = userRequesting.idx;
        dto.status = Status_enum_1.Status.PENDING;
        const serviceBusBodyDto = {
            dto: dto,
            createUserTypeTemplate: "Request"
        };
        const serviceBusDto = {
            serviceType: 'create-usertype-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
    async deleteUserType(idx, userRequesting) {
        const checkUserTypeExists = await this.userTypeRepo.findOne({
            where: { idx, is_obsolete: false },
        });
        if (!checkUserTypeExists) {
            throw new common_1.HttpException('User type not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (checkUserTypeExists.user_type.includes('Default')) {
            throw new common_1.HttpException('Default usertype cannot be deleted', common_1.HttpStatus.FORBIDDEN);
        }
        if (userRequesting.is_superadmin === true) {
            const serviceBusBodyDto = {
                idx: idx,
                is_obsolete: true,
                action: "update"
            };
            const serviceBusDto = {
                serviceType: 'delete-usertype-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return {
                statusCode: 200,
                message: 'User type Deleted',
            };
        }
        const userType = await this.userTypeRepo.findOne({
            idx,
        });
        const serviceBusBodyDto = {
            user_type: userType.user_type,
            description: userType.description,
            status: Status_enum_1.Status.PENDING,
            operation: operations_enum_1.Operations.DELETE,
            userType: userType,
            created_by: userRequesting.idx,
            action: "save"
        };
        const serviceBusDto = {
            serviceType: 'delete-usertype-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
    async updateUserTypeName(userType, idx, userRequesting) {
        const checkUserTypeExists = await this.userTypeRepo.findOne({
            idx,
            is_obsolete: false,
        });
        if (!checkUserTypeExists) {
            throw new common_1.HttpException('User type not found', common_1.HttpStatus.NOT_FOUND);
        }
        const userTypeNameExistsInActive = await this.userTypeRepo.findOne({
            user_type: userType.user_type,
            idx: typeorm_2.Not(idx),
        });
        if (userTypeNameExistsInActive) {
            throw new common_1.HttpException('User type with given name already exists', common_1.HttpStatus.CONFLICT);
        }
        if (userRequesting.is_superadmin === true) {
            const serviceBusBodyDto = {
                user_type: userType.user_type,
                description: userType.description,
                idx: idx,
                action: "update"
            };
            const serviceBusDto = {
                serviceType: 'upadte-usertype-name-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Updated user type name' };
        }
        const userTypeFromIdx = await this.userTypeRepo.findOne({ idx });
        console.info(userTypeFromIdx);
        const serviceBusBodyDto = {
            userType: userTypeFromIdx,
            operation: operations_enum_1.Operations.UPDATE_USERTYPE_NAME,
            status: Status_enum_1.Status.PENDING,
            user_type: userType.user_type,
            description: userType.description,
            created_by: userRequesting.idx,
            action: "save"
        };
        const serviceBusDto = {
            serviceType: 'upadte-usertype-name-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
    async VerifyUserType(merchantData, idxVal, userRequesting) {
        const tempUserType = await this.userTypeTempRepo.findOne({
            where: {
                idx: idxVal,
            },
        });
        if (!tempUserType) {
            throw new common_1.HttpException('No usertype verification with the given idx', common_1.HttpStatus.NOT_FOUND);
        }
        if (tempUserType.status === 'APPROVED' ||
            tempUserType.status === 'REJECTED') {
            throw new common_1.HttpException('Request already processed', common_1.HttpStatus.BAD_REQUEST);
        }
        if (tempUserType.created_by === userRequesting.idx &&
            userRequesting.is_superadmin !== true) {
            throw new common_1.HttpException('Cannot verify own request', common_1.HttpStatus.BAD_REQUEST);
        }
        if (merchantData.status === Status_enum_1.Status.REJECTED) {
            if (!merchantData.rejection_reason ||
                merchantData.rejection_reason === '') {
                throw new common_1.HttpException('Rejection reason is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const serviceBusBodyDto = {
                status: operations_enum_1.Operations.REJECTED,
                idx: idxVal,
                type: "rejected"
            };
            const serviceBusDto = {
                serviceType: 'verify-user-type-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Rejected' };
        }
        const _a = await this.userTypeTempRepo.findOne({
            where: { idx: idxVal },
            relations: ['userType'],
        }), { operation } = _a, tempData = __rest(_a, ["operation"]);
        if (operation === operations_enum_1.Operations.CREATE) {
            const serviceBusBodyDto = {
                tempData: tempData,
                idx: idxVal,
                type: "create"
            };
            const serviceBusDto = {
                serviceType: 'verify-user-type-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
        if (operation === operations_enum_1.Operations.UPDATE_USERTYPE_NAME) {
            const serviceBusBodyDto = {
                tempData: tempData,
                idx: idxVal,
                type: "updateUserType"
            };
            const serviceBusDto = {
                serviceType: 'verify-user-type-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
        if (operation === operations_enum_1.Operations.UPDATE_USERTYPE_PERMISSIONS) {
            const { id, userType } = tempData;
            const serviceBusBodyDto = {
                tempData: tempData,
                userType: userType,
                id: id,
                idxVal: idxVal,
                type: "updateUserTypePermission"
            };
            const serviceBusDto = {
                serviceType: 'verify-user-type-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
        if (operation === operations_enum_1.Operations.DELETE) {
            const tempRole = await this.userTypeTempRepo.findOne({
                where: {
                    idx: idxVal,
                },
                relations: ['userType'],
            });
            const serviceBusBodyDto = {
                id: tempRole.userType.id,
                idxVal: idxVal,
                type: "delete"
            };
            const serviceBusDto = {
                serviceType: 'verify-user-type-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Request Approved' };
        }
    }
    async CheckPermissionExists(permissionArray) {
        const permissions = await this.permissionRepo.find({
            where: { idx: typeorm_2.In(permissionArray) },
        });
        if ((permissions === null || permissions === void 0 ? void 0 : permissions.length) == (permissionArray === null || permissionArray === void 0 ? void 0 : permissionArray.length)) {
            return true;
        }
        return false;
    }
    async updateUserTypePermissions(userType, idx, userRequesting) {
        const checkUserTypeExists = await this.userTypeRepo.findOne({
            idx,
            is_obsolete: false,
        });
        if (!checkUserTypeExists) {
            throw new common_1.HttpException('Usertype not found', common_1.HttpStatus.NOT_FOUND);
        }
        const permissionExists = await this.CheckPermissionExists(userType.permission);
        if (!permissionExists) {
            throw new common_1.HttpException('Some permissions are invalid', common_1.HttpStatus.BAD_REQUEST);
        }
        const incomingPermissions = await this.permissionRepo.find({
            where: { idx: typeorm_2.In(userType.permission) },
            select: ['id', 'base_name'],
        });
        if (userRequesting.is_superadmin === true) {
            const serviceBusBodyDto = {
                checkUserTypeExists: checkUserTypeExists,
                incomingPermissions: incomingPermissions,
                userType: userType,
                type: "superadmin"
            };
            const serviceBusDto = {
                serviceType: 'update-user-type-user-operation',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(topicName, serviceBusDto);
            return { statusCode: 200, message: 'Updated user type permissions' };
        }
        const serviceBusBodyDto = {
            user_type: checkUserTypeExists.user_type,
            userType: checkUserTypeExists,
            operation: operations_enum_1.Operations.UPDATE_USERTYPE_PERMISSIONS,
            status: Status_enum_1.Status.PENDING,
            description: checkUserTypeExists.description,
            created_by: userRequesting.idx,
            incomingPermissions: incomingPermissions
        };
        const serviceBusDto = {
            serviceType: 'update-user-type-user-operation',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(topicName, serviceBusDto);
        return { statusCode: 200, message: 'Request awaiting approval' };
    }
};
UserOperationService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Permission_1.Permission)),
    __param(1, typeorm_1.InjectRepository(PermissionUserType_1.PermissionUserType)),
    __param(2, typeorm_1.InjectRepository(PermissionUserTypeTemp_1.PermissionUserTypeTemp)),
    __param(4, typeorm_1.InjectRepository(Users_1.Users)),
    __param(5, typeorm_1.InjectRepository(WrongUserLog_1.WrongUserLog)),
    __param(6, typeorm_1.InjectRepository(InviteEmployerLog_1.InviteEmployerLog)),
    __param(7, typeorm_1.InjectRepository(UsersTemp_1.UsersTemp)),
    __param(8, typeorm_1.InjectRepository(UserType_1.UserType)),
    __param(9, typeorm_1.InjectRepository(Customer_entity_1.Customer)),
    __param(10, typeorm_1.InjectRepository(WorkLog_entity_1.WorkLog)),
    __param(11, typeorm_1.InjectRepository(UserTypeTemp_1.UserTypeTemp)),
    __param(12, typeorm_1.InjectRepository(CompanyUser_1.CompanyUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        service_bus_sender_service_1.ServiceBusSenderService,
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