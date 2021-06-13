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
exports.EmployerAuthService = void 0;
const SetPassword_dto_1 = require("../../dtos/SetPassword.dto");
const employerLogin_dto_1 = require("../../dtos/employerLogin.dto");
const EmailLog_1 = require("../../entities/EmailLog");
const PasswordHistoryLog_1 = require("../../entities/PasswordHistoryLog");
const Permission_1 = require("../../entities/Permission");
const Protocol_1 = require("../../entities/Protocol");
const Users_1 = require("../../entities/Users");
const OtpLog_1 = require("../../entities/OtpLog");
const ChangeUserPass_dto_1 = require("../../dtos/ChangeUserPass.dto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const helpers_1 = require("../../utils/helpers");
const helpers_2 = require("../../utils/helpers");
const jwt_1 = require("@nestjs/jwt");
const tokens_service_1 = require("../token/tokens.service");
const typeorm_2 = require("@nestjs/typeorm");
const captcha_1 = require("../../utils/captcha");
const argon = require("argon2");
const allRoutes_1 = require("../../common/constants/allRoutes");
const mappedData_1 = require("../../common/constants/mappedData");
const response_interface_1 = require("../../common/interfaces/response.interface");
const index_1 = require("../../config/index");
const js_utils_1 = require("@rubiin/js-utils");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const async_1 = require("nanoid/async");
const service_bus_sender_service_1 = require("../service-bus-sender/service-bus-sender.service");
const protocol_dto_1 = require("../../dtos/protocol.dto");
const EmployerSettings_entity_1 = require("../../entities/EmployerSettings.entity");
const create_setting_dto_1 = require("../../dtos/create-setting.dto");
const ActivityLog_1 = require("../../entities/ActivityLog");
const date_fns_1 = require("date-fns");
const connectionString = index_1.default.sbSenderConnectionString;
const maxRetries = index_1.default.sbSenderMaxRetries;
const REQUEST_APPROVE_SUCCESS_MSG = 'Request Approved Successfully';
const topicName = index_1.default.queueName;
const asyncTopicName = index_1.default.topicName;
let EmployerAuthService = class EmployerAuthService {
    constructor(jwtService, tokenService, serviceBusService, usersRepo, activityLogRepo, emailLogRepo, permissionRepo, protocolRepo, employerSettingsRepo, otpRepo, passwordHistoryRepo) {
        this.jwtService = jwtService;
        this.tokenService = tokenService;
        this.serviceBusService = serviceBusService;
        this.usersRepo = usersRepo;
        this.activityLogRepo = activityLogRepo;
        this.emailLogRepo = emailLogRepo;
        this.permissionRepo = permissionRepo;
        this.protocolRepo = protocolRepo;
        this.employerSettingsRepo = employerSettingsRepo;
        this.otpRepo = otpRepo;
        this.passwordHistoryRepo = passwordHistoryRepo;
        this.nanoid = async_1.customAlphabet('1234567890', 6);
    }
    async loginEmployer(userDto, ip) {
        var _a;
        let scenario = 0;
        const isCaptchaCorrect = await captcha_1.verifyCaptcha(userDto.captcha, userDto.captcha_token);
        userDto.password = unescape(userDto.password);
        if (!isCaptchaCorrect) {
            throw new common_1.HttpException('Captcha is incorrect', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersRepo.findOne({
            where: {
                email: userDto.email,
                is_obsolete: false,
            },
            relations: ['user_type'],
        });
        console.info(user);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.is_obsolete) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        if (((_a = user === null || user === void 0 ? void 0 : user.user_type) === null || _a === void 0 ? void 0 : _a.user_type) !== 'Default-Employer') {
            throw new common_1.BadRequestException('Cannot login orbisadmin to employer dashboard');
        }
        if (user) {
            if (user.password === '' || !user.password) {
                throw new common_1.HttpException('Password not set', common_1.HttpStatus.BAD_REQUEST);
            }
            if (await argon.verify(user.password, userDto.password)) {
                if (!user.is_active) {
                    throw new common_1.UnauthorizedException('Account was locked due to multiple failed logins');
                }
                const activityLogArray = await this.activityLogRepo.find({
                    where: {
                        user_id: user,
                        is_obsolete: false,
                        activity_type: 'LOGIN',
                    },
                    select: ['id', 'login_status', 'is_obsolete', 'created_on'],
                    order: {
                        created_on: "DESC",
                    }
                });
                console.log('Activity Log Array LOGIN ATTEMPT TEST ********** ----> ' + JSON.stringify(activityLogArray));
                let updateLog = [];
                activityLogArray.every(elm => {
                    if (!elm.login_status) {
                        updateLog.push(elm.id);
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                console.log('Activity log ids To make obsolete ****----> ' + JSON.stringify(updateLog));
                if (updateLog.length > 0) {
                    const serviceBusBodyDto = {
                        is_obsolete: true,
                        id: updateLog,
                    };
                    const serviceBusDto = {
                        serviceType: 'update-activity-log-employer-login',
                        body: serviceBusBodyDto,
                    };
                    await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                }
                const serviceBusBodyDto = {
                    user: user,
                    ip: ip
                };
                const serviceBusDto = {
                    serviceType: 'save-activity-log-employer-login',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                const payload = {
                    idx: user.idx,
                    email: user.email,
                };
                const accessToken = await this.tokenService.generateAccessToken(user);
                const { payroll_system: provider_name, contact_name, idx } = user;
                const response = {
                    provider_name,
                    contact_name,
                    idx,
                };
                return { message: 'Successfully signed in', accessToken, response };
            }
            else {
                const protocolSettings = await this.protocolRepo.findOne({
                    where: {
                        is_active: true,
                        is_obsolete: false,
                    },
                    select: [
                        'login_attempt_interval',
                        'login_interval_unit',
                        'login_max_retry',
                    ],
                });
                const serviceBusBodyDto = {
                    user: user,
                    ip: ip
                };
                const serviceBusDto = {
                    serviceType: 'save-activity-log-employer-login',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                const activityLog = await this.activityLogRepo.find({
                    where: {
                        created_on: typeorm_1.Between(date_fns_1.startOfDay(helpers_2.subtractDate(protocolSettings.login_interval_unit, protocolSettings.login_attempt_interval)).toISOString(), date_fns_1.endOfDay(new Date()).toISOString()),
                        login_status: false,
                        user_id: user,
                        is_obsolete: false,
                        activity_type: 'LOGIN',
                    },
                });
                if (activityLog.length >= protocolSettings.login_max_retry) {
                    const serviceBusBodyDto = {
                        is_active: false,
                        id: user.id,
                    };
                    const serviceBusDto = {
                        serviceType: 'update-user-repo-login',
                        body: serviceBusBodyDto,
                    };
                    await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                    throw new common_1.HttpException('Account locked due to multiple incorrect logins', common_1.HttpStatus.FORBIDDEN);
                }
                else {
                    throw new common_1.UnauthorizedException(`Invalid credentials. You have  ${protocolSettings.login_max_retry - activityLog.length} attempts left before your account gets locked.`);
                }
            }
        }
        else {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async loginUser(userDto, ip) {
        var _a;
        let scenario = 0;
        const isCaptchaCorrect = await captcha_1.verifyCaptcha(userDto.captcha, userDto.captcha_token);
        userDto.password = unescape(userDto.password);
        if (!isCaptchaCorrect) {
            throw new common_1.HttpException('Captcha is incorrect', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersRepo.findOne({
            where: {
                email: userDto.email,
                is_obsolete: false,
            },
            relations: ['user_type'],
        });
        if (!user) {
            console.log('User not found ------');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.is_obsolete) {
            console.log('User is obsolete ------');
            throw new common_1.BadRequestException('Invalid credentials');
        }
        console.info(user);
        if (((_a = user === null || user === void 0 ? void 0 : user.user_type) === null || _a === void 0 ? void 0 : _a.user_type) === 'Default-Employer') {
            throw new common_1.BadRequestException('Cannot login employer to admin dashboard');
        }
        if (user) {
            if (user.password === '' || !user.password) {
                throw new common_1.HttpException('Password not set', common_1.HttpStatus.BAD_REQUEST);
            }
            if (await argon.verify(user.password, userDto.password)) {
                console.log('Password Verified successflly ------');
                if (!user.is_active) {
                    console.log('User is not active ------');
                    throw new common_1.UnauthorizedException('Account was locked due to multiple failed logins');
                }
                const activityLogArray = await this.activityLogRepo.find({
                    where: {
                        user_id: user,
                        is_obsolete: false,
                        activity_type: 'LOGIN',
                    },
                    select: ['id', 'login_status', 'is_obsolete', 'created_on'],
                    order: {
                        created_on: "DESC",
                    }
                });
                console.log('Activity Log Array LOGIN ATTEMPT TEST ********** ----> ' + JSON.stringify(activityLogArray));
                let updateLog = [];
                activityLogArray.every(elm => {
                    if (!elm.login_status) {
                        updateLog.push(elm.id);
                        return true;
                    }
                    else {
                        return false;
                    }
                });
                console.log('Activity log ids To make obsolete ****----> ' + JSON.stringify(updateLog));
                if (updateLog.length > 0) {
                    const serviceBusBodyDto = {
                        is_obsolete: true,
                        id: updateLog,
                    };
                    const serviceBusDto = {
                        serviceType: 'update-activity-log-user-login',
                        body: serviceBusBodyDto,
                    };
                    await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                }
                const serviceBusBodyDto = {
                    user: user,
                    ip: ip
                };
                const serviceBusDto = {
                    serviceType: 'save-activity-log-user-login',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                const payload = {
                    email: userDto.email,
                    id: user.id,
                    idx: user.idx,
                    is_superadmin: user.is_superadmin,
                };
                const accessToken = await this.tokenService.generateAccessToken(user);
                const { id, idx, contact_name, email, address, is_superadmin } = user;
                const response = {
                    id,
                    idx,
                    email,
                    address,
                    contact_name,
                    is_superadmin,
                };
                return { message: 'Successfully signed in', accessToken, response };
            }
            else {
                const protocolSettings = await this.protocolRepo.findOne({
                    where: {
                        is_active: true,
                        is_obsolete: false,
                    },
                    select: [
                        'login_attempt_interval',
                        'login_interval_unit',
                        'login_max_retry',
                    ],
                });
                const serviceBusBodyDto = {
                    user: user,
                    ip: ip
                };
                const serviceBusDto = {
                    serviceType: 'save-activity-log-user-login',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                const activityLog = await this.activityLogRepo.find({
                    where: {
                        created_on: typeorm_1.Between(date_fns_1.startOfDay(helpers_2.subtractDate(protocolSettings.login_interval_unit, protocolSettings.login_attempt_interval)).toISOString(), date_fns_1.endOfDay(new Date()).toISOString()),
                        login_status: false,
                        user_id: user,
                        is_obsolete: false,
                        activity_type: 'LOGIN',
                    },
                });
                if (activityLog.length >= protocolSettings.login_max_retry) {
                    const serviceBusBodyDto = {
                        is_active: false,
                        id: user.id,
                    };
                    const serviceBusDto = {
                        serviceType: 'update-user-repo-login',
                        body: serviceBusBodyDto,
                    };
                    await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                    throw new common_1.HttpException('Account locked due to multiple incorrect logins', common_1.HttpStatus.FORBIDDEN);
                }
                else {
                    throw new common_1.UnauthorizedException(`Invalid credentials. You have  ${protocolSettings.login_max_retry - activityLog.length} attempts left before your account gets locked.`);
                }
            }
        }
        else {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async checkLink(token) {
        const isLinkUsed = await this.emailLogRepo.findOne({
            where: {
                token,
            },
            select: ['is_active'],
        });
        if (!isLinkUsed) {
            throw new common_1.HttpException('Token is invalid', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!isLinkUsed.is_active) {
            throw new common_1.HttpException('Token already used', common_1.HttpStatus.BAD_REQUEST);
        }
        return { statusCode: 200, message: 'Token is correct' };
    }
    async setPassword(passwordDto) {
        const link = await this.emailLogRepo.findOne({
            where: {
                token: passwordDto.token,
            },
            relations: ['user'],
        });
        if (!link.is_active) {
            throw new common_1.HttpException('Link is used', common_1.HttpStatus.NOT_FOUND);
        }
        if (!link) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const pwdHash = await helpers_1.hashString(passwordDto.password);
        const serviceBusBodyDto = {
            idx: link.user.idx,
            password: pwdHash,
            token: passwordDto.token,
            user_id: link.user
        };
        const serviceBusDto = {
            serviceType: 'set-password-employer-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Password set' };
    }
    async authenticateRoute(header, result) {
        const permission = await this.permissionRepo.findOne({
            where: { method: header.method, url: header.url },
        });
        if (!permission) {
            throw new common_1.HttpException('The route permission does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        return result.some(el => el.alias === permission.alias);
    }
    async sendAllMappedRoutes(allAccessibleRoutes) {
        const mappedRoutes = [];
        for (const route of allAccessibleRoutes) {
            if (mappedData_1.default.hasOwnProperty(route)) {
                const accessData = mappedData_1.default[route];
                for (const data of accessData) {
                    if (!mappedRoutes.includes(data)) {
                        mappedRoutes.push(data);
                    }
                }
            }
        }
        const routes = {};
        for (const element of mappedRoutes) {
            routes[element] = true;
        }
        return routes;
    }
    async listAllAccessibleAlias(userRequesting) {
        let allowedRoutes;
        const users = await this.usersRepo.findOne({
            where: { id: userRequesting.id },
            relations: ['user_type'],
        });
        console.info('incoming user ' + users, 'Authservice');
        let result = [];
        if (users.is_superadmin) {
            allowedRoutes = allRoutes_1.default;
        }
        else {
            result = await typeorm_1.getConnection().query('EXECUTE list_accessible_routes @0', [users.user_type.idx]);
            const allAccessibleRoutes = js_utils_1.objectArrayToArray(result, 'alias');
            console.info('before mapped route');
            console.warn(result, 'AuthService before');
            allowedRoutes = this.sendAllMappedRoutes(allAccessibleRoutes);
            console.info('after mapped route');
            console.info('AuthService after ' + allowedRoutes);
        }
        return allowedRoutes;
    }
    async getAllPermission(query) {
        const withQueryObject = {
            is_obsolete: false,
            permission_type: query === null || query === void 0 ? void 0 : query.toUpperCase(),
        };
        const withoutQueryObject = {
            is_obsolete: false,
        };
        const result = await this.permissionRepo.find({
            where: query ? withQueryObject : withoutQueryObject,
            select: ['idx', 'base_name', 'url', 'method', 'is_active', 'alias'],
        });
        if (!result) {
            throw new common_1.HttpException('Not found', common_1.HttpStatus.NOT_FOUND);
        }
        return result;
    }
    async getPermissionByIdx(idx) {
        const permission = await this.permissionRepo.findOne({
            idx,
            is_obsolete: false,
        });
        if (!permission) {
            throw new common_1.HttpException('Permission with idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        return permission;
    }
    async getAllProtocol() {
        return this.protocolRepo.find({
            where: {
                is_active: true,
                is_obsolete: false,
            },
        });
    }
    async updateProtocol(idx, protocolUpdate) {
        const protocolExists = await this.protocolRepo.findOne({
            idx,
            is_obsolete: false,
        });
        if (!protocolExists) {
            throw new common_1.HttpException('protocol with given Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        const serviceBusBodyDto = {
            idx: idx,
            protocolUpdate: protocolUpdate,
        };
        const serviceBusDto = {
            serviceType: 'update-protocol-employer-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Protocol updated' };
    }
    async getSetting(idx) {
        let setting = await this.employerSettingsRepo.findOne({
            created_by: idx,
            is_obsolete: false,
        });
        if (!setting) {
            setting = new EmployerSettings_entity_1.EmployerSettings(false, false);
        }
        return setting;
    }
    async addUpdateSettings(settingsDto, idx) {
        const settings = await this.employerSettingsRepo.findOne({
            where: {
                created_by: idx,
                is_obsolete: false,
            },
        });
        const serviceBusBodyDto = {
            settings: settings,
            settingsDto: settingsDto,
            idx: idx
        };
        const serviceBusDto = {
            serviceType: 'add-update-settings-employer-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Operation successful' };
    }
    async forgotPassword(forgotPassword) {
        const checkEmployeeWithEmail = await this.usersRepo.findOne({
            email: forgotPassword.employer_email,
            is_obsolete: false
        });
        if (!checkEmployeeWithEmail) {
            throw new common_1.HttpException('Employer with email address not found', common_1.HttpStatus.NOT_FOUND);
        }
        const otp_code = await this.nanoid();
        const otpLog = new OtpLog_1.OtpLog();
        otpLog.otp_code = otp_code;
        otpLog.user = checkEmployeeWithEmail;
        const serviceBusBodyDto = {
            otpLog: otpLog,
            otp_code: otp_code,
            email: forgotPassword.employer_email,
            name: checkEmployeeWithEmail.contact_name,
        };
        const serviceBusDto = {
            serviceType: 'forgot-password-employer-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: `Please check your email for code` };
    }
    async resetPassword(resetPassword) {
        const checkOtpExists = await this.otpRepo.findOne({
            where: {
                otp_code: resetPassword.otp_code,
                is_active: true,
            },
            relations: ['user'],
        });
        if (!checkOtpExists) {
            throw new common_1.HttpException('OTP is invalid', common_1.HttpStatus.BAD_REQUEST);
        }
        resetPassword.password = unescape(resetPassword.password);
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(resetPassword.password))) {
            console.log('Manual Check Failed ......-------------------->');
            throw new common_1.HttpException('New password must contain at least 1 special character,uppercase letter, lowercase letter and number each', common_1.HttpStatus.BAD_REQUEST);
        }
        const pwdHash = await helpers_1.hashString(resetPassword.password);
        const serviceBusBodyDto = {
            otp_code: resetPassword.otp_code,
            id: checkOtpExists.user.id,
            password: pwdHash
        };
        console.log('Resset Password Service bus Data sent --->' + JSON.stringify(serviceBusBodyDto));
        const serviceBusDto = {
            serviceType: 'reset-password-employer-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 201, message: `Password updated successfully` };
    }
    async changePassword(password, idx) {
        password.password = unescape(password.password);
        password.current_password = unescape(password.current_password);
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(password.password))) {
            console.log('Manual Check Failed ......-------------------->');
            throw new common_1.HttpException('New password must contain at least 1 special character,uppercase letter, lowercase letter and number each and must be between 8 to 64 chacarters long', common_1.HttpStatus.BAD_REQUEST);
        }
        const userExists = await this.usersRepo.findOne({
            idx,
            is_obsolete: false,
        });
        if (!userExists) {
            throw new common_1.HttpException('User does not exist', common_1.HttpStatus.CONFLICT);
        }
        const checkPassword = await argon.verify(userExists.password, password.current_password);
        if (!checkPassword) {
            throw new common_1.HttpException('Current password do not match', common_1.HttpStatus.BAD_REQUEST);
        }
        const { pw_repeatable_after } = await this.protocolRepo.findOne({
            select: ['pw_repeatable_after'],
        });
        const previousPassword = await this.passwordHistoryRepo.find({
            where: {
                user_id: userExists,
            },
            select: ['password'],
            take: pw_repeatable_after,
            order: {
                created_on: 'DESC',
            },
        });
        let equalsPreviousPassword = false;
        for (const el of previousPassword) {
            equalsPreviousPassword = await argon.verify(el.password, password.password, {
                parallelism: 2,
            });
            if (equalsPreviousPassword) {
                break;
            }
        }
        if (equalsPreviousPassword) {
            throw new common_1.HttpException('Same password can only be used after 3 times', common_1.HttpStatus.BAD_REQUEST);
        }
        password.password = await helpers_1.hashString(password.password);
        const serviceBusBodyDto = {
            user_id: userExists,
            password: password.password
        };
        const serviceBusDto = {
            serviceType: 'change-password-employer-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'User password changed' };
    }
};
EmployerAuthService = __decorate([
    common_1.Injectable(),
    __param(3, typeorm_2.InjectRepository(Users_1.Users)),
    __param(4, typeorm_2.InjectRepository(ActivityLog_1.ActivityLog)),
    __param(5, typeorm_2.InjectRepository(EmailLog_1.EmailLog)),
    __param(6, typeorm_2.InjectRepository(Permission_1.Permission)),
    __param(7, typeorm_2.InjectRepository(Protocol_1.Protocol)),
    __param(8, typeorm_2.InjectRepository(EmployerSettings_entity_1.EmployerSettings)),
    __param(9, typeorm_2.InjectRepository(OtpLog_1.OtpLog)),
    __param(10, typeorm_2.InjectRepository(PasswordHistoryLog_1.PasswordHistoryLog)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        tokens_service_1.TokensService,
        service_bus_sender_service_1.ServiceBusSenderService,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], EmployerAuthService);
exports.EmployerAuthService = EmployerAuthService;
//# sourceMappingURL=employer-auth.service.js.map