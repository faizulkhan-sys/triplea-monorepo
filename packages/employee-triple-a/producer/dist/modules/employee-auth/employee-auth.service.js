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
exports.EmployeeAuthService = void 0;
const helpers_1 = require("../../utils/helpers");
const service_bus_sender_service_1 = require("../service-bus-sender/service-bus-sender.service");
const common_1 = require("@nestjs/common");
const js_utils_1 = require("@rubiin/js-utils");
const helpers_2 = require("../../utils/helpers");
const helpers_3 = require("../../utils/helpers");
const typeorm_1 = require("@nestjs/typeorm");
const status_enum_1 = require("../../common/constants/status.enum");
const Customer_entity_1 = require("../../entities/Customer.entity");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const Criterias_entity_1 = require("../../entities/Criterias.entity");
const ActivityLog_entity_1 = require("../../entities/ActivityLog.entity");
const operations_enum_1 = require("../../common/constants/operations.enum");
const async_1 = require("nanoid/async");
const tokens_service_1 = require("../token/tokens.service");
const common_2 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const OtpLog_entity_1 = require("../../entities/OtpLog.entity");
const employeeLogin_dto_1 = require("../../dtos/employeeLogin.dto");
const response_interface_1 = require("../../common/interfaces/response.interface");
const argon = require("argon2");
const nest_winston_1 = require("nest-winston");
const ListQuery_dto_1 = require("../../dtos/ListQuery.dto");
const config = require("../../config/index");
const date_fns_2 = require("date-fns");
const typeorm_2 = require("typeorm");
const SearchFilters_entity_1 = require("../../entities/SearchFilters.entity");
const AddFilter_1 = require("../../dtos/AddFilter");
const Derived_dto_2 = require("../../dtos/Derived.dto");
const UpdateFilter_1 = require("../../dtos/UpdateFilter");
const connectionString = config.default.sbSenderConnectionString;
const maxRetries = config.default.sbSenderMaxRetries;
const REQUEST_APPROVE_SUCCESS_MSG = 'Request Approved Successfully';
const topicName = config.default.queueName;
const asyncTopicName = config.default.topicName;
let EmployeeAuthService = class EmployeeAuthService {
    constructor(criteriaRepo, searchFilterRepo, customerRepository, protocolRepo, otpLogRepository, activityLogRepo, serviceBusService, tokenService, logger) {
        this.criteriaRepo = criteriaRepo;
        this.searchFilterRepo = searchFilterRepo;
        this.customerRepository = customerRepository;
        this.protocolRepo = protocolRepo;
        this.otpLogRepository = otpLogRepository;
        this.activityLogRepo = activityLogRepo;
        this.serviceBusService = serviceBusService;
        this.tokenService = tokenService;
        this.logger = logger;
        this.nanoid = async_1.customAlphabet('1234567890', 6);
    }
    async loginEmployee(emplLogin) {
        this.logger.log('Inside login Employee service', JSON.stringify(emplLogin));
        let scenario = 0;
        let user;
        emplLogin.password = unescape(emplLogin.password);
        switch (emplLogin.login_type) {
            case 0:
                user = await this.customerRepository.findOne({
                    where: { email: emplLogin.email },
                });
                break;
            case 1:
                user = await this.customerRepository.findOne({
                    where: {
                        fb_id: emplLogin.login_id,
                    },
                });
                break;
            case 2:
                user = await this.customerRepository.findOne({
                    where: {
                        google_id: emplLogin.login_id,
                    },
                });
                break;
        }
        if (!user) {
            if (emplLogin.login_type === 0) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            else {
                return { statusCode: 200, message: JSON.stringify({ isRegistered: false }) };
            }
        }
        if (user.is_obsolete) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        if (!user.is_registered) {
            throw new common_1.HttpException('Account not found for this email. Please create new account from the Login screen.', common_1.HttpStatus.FORBIDDEN);
        }
        if (user && emplLogin.login_type === 0) {
            if (await argon.verify(user.password, emplLogin.password)) {
                if (!user.is_active) {
                    throw new common_1.HttpException('Account was locked due to multiple failed logins', common_1.HttpStatus.FORBIDDEN);
                }
                const activityLogArray = await this.activityLogRepo.find({
                    where: {
                        user: user,
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
                        serviceType: 'update-activity-log-employee-login',
                        body: serviceBusBodyDto,
                    };
                    await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                }
                const serviceBusBodyDto = {
                    user: user,
                };
                const serviceBusDto = {
                    serviceType: 'save-activity-log-employee-login',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                const token = await this.tokenService.generateAccessToken(user);
                const refresh = await this.tokenService.generateRefreshToken(user, config.default.jwt.refresh_expiry);
                const payload = helpers_1.buildResponsePayload(user, token, refresh);
                console.log('API Login response : ' + JSON.stringify(payload));
                return ({
                    message: 'Successfully signed in',
                    data: payload,
                });
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
                };
                const serviceBusDto = {
                    serviceType: 'save-activity-log-false-employee-login',
                    body: serviceBusBodyDto,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
                const activityLog = await this.activityLogRepo.find({
                    where: {
                        created_on: typeorm_2.Between(date_fns_2.startOfDay(helpers_2.subtractDate(protocolSettings.login_interval_unit, protocolSettings.login_attempt_interval)).toISOString(), date_fns_2.endOfDay(new Date()).toISOString()),
                        login_status: false,
                        status: false,
                        user: user,
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
                        serviceType: 'update-employee-repo-login',
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
        if (user &&
            (emplLogin.login_type === 1 || emplLogin.login_type === 2)) {
            const token = await this.tokenService.generateAccessToken(user);
            const refresh = await this.tokenService.generateRefreshToken(user, config.default.jwt.refresh_expiry);
            const payload = helpers_1.buildResponsePayload(user, token, refresh);
            console.log('API Login response : ' + JSON.stringify(payload));
            return ({
                message: 'Successfully signed in',
                data: payload,
            });
        }
    }
    async resetMpin(resetMpin) {
        const checkOtpExists = await this.otpLogRepository.findOne({
            where: {
                otp_code: resetMpin.otp_code,
                is_active: true,
            },
            relations: ['user'],
        });
        if (!checkOtpExists) {
            throw new common_1.HttpException('OTP is invalid', common_1.HttpStatus.BAD_REQUEST);
        }
        const serviceBusBodyDto = {
            otp_code: resetMpin.otp_code,
            id: checkOtpExists.user.id,
            mpin: resetMpin.mpin
        };
        const serviceBusDto = {
            serviceType: 'reset-mpin-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 201, message: `Mpin updated successfully` };
    }
    async forgetMpin(employee) {
        const checkCustomerWithEmail = await this.customerRepository.findOne({
            email: employee.email,
            is_active: true,
        });
        if (!checkCustomerWithEmail) {
            throw new common_1.HttpException('Employee with email address not found', common_1.HttpStatus.NOT_FOUND);
        }
        const otp_code = await this.nanoid();
        const otpLog = new OtpLog_entity_1.OtpLog();
        otpLog.otp_code = otp_code;
        otpLog.user = employee;
        const serviceBusDto = {
            serviceType: 'forget-mpin-employee-auth',
            body: otpLog,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: `Please check your email for code` };
    }
    async changeMpin(employee, mpinDto) {
        if (employee.mpin !== mpinDto.mpin) {
            throw new common_1.HttpException('Current mpin is incorrect', common_1.HttpStatus.BAD_REQUEST);
        }
        const serviceBusBodyDto = {
            idx: employee.idx,
            mpin: mpinDto.new_mpin,
        };
        const serviceBusDto = {
            serviceType: 'change-mpin-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Operation successful' };
    }
    async changePassword(changePassword, employee) {
        changePassword.password = unescape(changePassword.password);
        changePassword.new_password = unescape(changePassword.new_password);
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(changePassword.new_password))) {
            console.log('Manual Check Failed ......-------------------->');
            throw new common_1.HttpException('New password must contain at least 1 special character,uppercase letter, lowercase letter and number each', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(changePassword.password))) {
            console.log('Manual Check Failed ......-------------------->');
            throw new common_1.HttpException('Current password is invalid', common_1.HttpStatus.BAD_REQUEST);
        }
        const customer = await this.customerRepository.findOne({
            where: {
                idx: employee.idx,
                is_obsolete: false,
            },
        });
        if (!customer) {
            throw new common_1.HttpException('Customer not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (changePassword.new_password === changePassword.password) {
            throw new common_1.HttpException('Current password and new password cannot be same', common_1.HttpStatus.BAD_REQUEST);
        }
        const isPasswordCorrect = await argon.verify(customer.password, changePassword.password);
        if (!isPasswordCorrect) {
            throw new common_1.HttpException('Current password does not match', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPwd = await helpers_3.hashString(changePassword.new_password);
        const serviceBusBodyDto = {
            idx: employee.idx,
            password: hashedPwd,
        };
        const serviceBusDto = {
            serviceType: 'change-password-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Password Updated' };
    }
    async resetPassword(resetPassword) {
        const checkOtpExists = await this.otpLogRepository.findOne({
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
        const pwdHash = await helpers_3.hashString(resetPassword.password);
        const serviceBusBodyDto = {
            otp_code: resetPassword.otp_code,
            id: checkOtpExists.user.id,
            password: pwdHash
        };
        const serviceBusDto = {
            serviceType: 'reset-password-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 201, message: `Password updated successfully` };
    }
    async verifyMpin(employee, mpinDto) {
        if (employee.mpin !== mpinDto.mpin) {
            const serviceBusBodyDto = {
                customer: employee,
                device: '',
                ip: '',
                login_type: 'MOBILE',
                activity_type: 'MPIN_VERIFY'
            };
            const serviceBusDto = {
                serviceType: 'verify-mpin-employee-auth',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
            const protocolSettings = await typeorm_2.getConnection()
                .getRepository(Protocol_entity_1.Protocol)
                .findOne({
                where: {
                    is_active: true,
                    is_obsolete: false,
                },
                select: [
                    'mpin_attempt_interval',
                    'mpin_interval_unit',
                    'mpin_max_retry',
                ],
            });
            const activityLog = await typeorm_2.getConnection()
                .getRepository(ActivityLog_entity_1.ActivityLog)
                .find({
                where: {
                    created_on: typeorm_2.Between(date_fns_2.startOfDay(helpers_2.subtractDate(protocolSettings.login_interval_unit, protocolSettings.login_attempt_interval)).toISOString(), date_fns_2.endOfDay(new Date()).toISOString()),
                    status: false,
                    user: employee,
                    activity_type: 'MPIN_VERIFY',
                },
            });
            if (activityLog.length >= protocolSettings.mpin_max_retry) {
                const serviceBusBodyDtoD = {
                    customer: employee,
                    is_active: false,
                    ip: '',
                    login_type: 'MOBILE',
                    activity_type: 'DEACTIVATE'
                };
                const serviceBusDtoD = {
                    serviceType: 'verify-mpin-employee-auth',
                    body: serviceBusBodyDtoD,
                };
                await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDtoD);
                throw new common_1.HttpException({
                    message: 'Oops! ',
                    sub: 'Sorry the account has been locked. Please connect with our Customer Care.',
                }, common_1.HttpStatus.FORBIDDEN);
            }
            throw new common_1.HttpException({
                message: 'Oops! Invalid MPIN',
                sub: `Sorry the MPIN was invalid.You have ${protocolSettings.mpin_max_retry - activityLog.length} attempts left before your account gets locked.`,
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        else {
            return { statusCode: 200, message: 'Mpin looks good' };
        }
    }
    async setMpin(employee, mpinDto) {
        if (employee.is_mpin_set) {
            throw new common_1.HttpException('Mpin is already set', common_1.HttpStatus.BAD_REQUEST);
        }
        const serviceBusBodyDto = {
            idx: employee.idx,
            is_mpin_set: true,
            mpin: mpinDto.mpin
        };
        const serviceBusDto = {
            serviceType: 'set-mpin-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Operation successful' };
    }
    async checkOtp(otp_code) {
        const checkOtpExists = await this.otpLogRepository.findOne({
            where: {
                otp_code,
                is_active: true,
            },
            relations: ['user'],
        });
        if (!checkOtpExists) {
            throw new common_1.HttpException('OTP is invalid', common_1.HttpStatus.BAD_REQUEST);
        }
        const protocolSettings = await this.protocolRepo.findOne({
            where: {
                is_active: true,
                is_obsolete: false,
            },
            select: ['otp_expiry_in_minutes'],
        });
        const diff = date_fns_1.differenceInMinutes(new Date(), new Date(checkOtpExists.created_on));
        if (diff > protocolSettings.otp_expiry_in_minutes) {
            throw new common_1.HttpException('OTP expired', common_1.HttpStatus.BAD_REQUEST);
        }
        return checkOtpExists;
    }
    async verifyOtp(otp_code) {
        await this.checkOtp(otp_code);
        return { statusCode: 200, message: 'Otp looks good' };
    }
    async forgotPassword(forgotPassword) {
        const checkCustomerWithEmail = await this.customerRepository.findOne({
            email: forgotPassword.email,
            is_obsolete: false
        });
        if (!checkCustomerWithEmail) {
            throw new common_1.HttpException('Employee with email address not found', common_1.HttpStatus.NOT_FOUND);
        }
        const otp_code = await this.nanoid();
        const otpLog = new OtpLog_entity_1.OtpLog();
        otpLog.otp_code = otp_code;
        otpLog.user = checkCustomerWithEmail;
        const data = {
            otp_code,
            email: forgotPassword.email,
            name: checkCustomerWithEmail.first_name,
            operation: 'reset password',
        };
        const serviceBusBodyDto = {
            otpLog: otpLog,
            data: data
        };
        const serviceBusDto = {
            serviceType: 'forgot-password-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: `Please check your email for code` };
    }
    async signupEmployee(signUpDto) {
        const checkIdxExists = await this.customerRepository.findOne({
            where: {
                idx: signUpDto.idx,
                is_obsolete: false,
            },
        });
        if (!checkIdxExists) {
            throw new common_1.HttpException('Employee with idx does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        if (checkIdxExists.is_registered) {
            throw new common_1.HttpException('Employee is already registered', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPwd = await helpers_3.hashString(signUpDto.password);
        const serviceBusBodyDto = {
            signUpDto: signUpDto,
            password: hashedPwd,
            checkIdxExists: checkIdxExists
        };
        const serviceBusDto = {
            serviceType: 'signup-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        checkIdxExists.email = signUpDto.email;
        const token = await this.tokenService.generateAccessToken(checkIdxExists);
        const refresh = await this.tokenService.generateRefreshToken(checkIdxExists, config.default.jwt.refresh_expiry);
        const payload = helpers_1.buildResponsePayload(checkIdxExists, token, refresh);
        return {
            message: 'Employee signup successful',
            data: payload,
        };
    }
    async logoutFromAll(employee) {
        return this.tokenService.deleteRefreshTokenForUser(employee);
    }
    async logout(employee, refreshToken) {
        const payload = await this.tokenService.decodeRefreshToken(refreshToken);
        return this.tokenService.deleteRefreshToken(employee, payload);
    }
    async changePasswordIdx(idx) {
        const pwd = await helpers_3.hashString('Test@1234');
        await typeorm_2.getConnection().getRepository(Customer_entity_1.Customer).update({
            idx,
        }, { mpin: '1234', password: pwd });
        return { statusCode: 200, message: `Change password done` };
    }
    async getAllfilters(listQuery, idx) {
        const { page, limit, search, status } = listQuery;
        const offset = limit * (page - 1);
        const query = typeorm_2.getRepository(SearchFilters_entity_1.SearchFilters)
            .createQueryBuilder('searchFilter')
            .where('searchFilter.is_obsolete = :is_obsolete', {
            is_obsolete: false,
        })
            .andWhere(new typeorm_2.Brackets(qb => {
            qb.where('searchFilter.created_by = :idx', {
                idx,
            }).orWhere('searchFilter.is_default_filter = :is_default_filter', { is_default_filter: true });
        }))
            .leftJoinAndSelect('searchFilter.criteria', 'criteria');
        if (status !== '') {
            query.andWhere('searchFilter.is_active = :status', {
                status: status.toLowerCase() === 'active',
            });
        }
        if (search !== '') {
            query.andWhere(new typeorm_2.Brackets(qb => {
                qb.where(`searchFilter.name LIKE :search`, {
                    search: `${search.toUpperCase()}%`,
                });
            }));
        }
        const [result, total] = await query
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        const count = [];
        for (let i = 0; i < result.length; i++) {
            const iterator = result[i];
            const qb = typeorm_2.getRepository(Customer_entity_1.Customer)
                .createQueryBuilder('customer')
                .where('customer.is_obsolete = :is_obsolete', {
                is_obsolete: false,
            })
                .andWhere('customer.employer_id = :id', { id: idx })
                .andWhere(`customer.${iterator.criteria.name} = :${iterator.criteria.name}${i}`, {
                [`${iterator.criteria.name}${i}`]: js_utils_1.autoParseValues(iterator.value),
            })
                .getCount();
            count.push(qb);
        }
        const filter_counts = await Promise.all(count);
        const pages = Math.ceil(total / limit);
        const host = helpers_3.getHost();
        return Object.assign(Object.assign({}, helpers_3.paginate(pages, page, total, host, result)), { filter_counts });
    }
    async createFilter(createDto, idx) {
        const checkFilterExists = await this.searchFilterRepo.findOne({
            where: {
                name: createDto.name,
                is_active: true,
                is_obsolete: false,
            },
        });
        if (checkFilterExists) {
            throw new common_1.HttpException('Filter with name already exists', common_1.HttpStatus.CONFLICT);
        }
        const checkCriteraiExists = await this.criteriaRepo.findOne({
            where: {
                idx: createDto.criteria,
                is_obsolete: false,
            },
        });
        if (!checkCriteraiExists) {
            throw new common_1.HttpException('Criteria does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        const searchFilter = new SearchFilters_entity_1.SearchFilters();
        searchFilter.name = createDto.name;
        searchFilter.value = createDto.value;
        searchFilter.criteria = checkCriteraiExists;
        searchFilter.is_default_filter = false;
        searchFilter.created_by = idx;
        const serviceBusBodyDto = {
            searchFilter: searchFilter
        };
        const serviceBusDto = {
            serviceType: 'create-filter-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Operation successful' };
    }
    async getFilterByIdx(idx, emploerIdx) {
        let res = await this.searchFilterRepo.findOne({
            where: [
                {
                    idx,
                    is_obsolete: false,
                    created_by: emploerIdx,
                },
                { idx, is_obsolete: false, is_default_filter: true },
            ],
            relations: ['criteria'],
        });
        if (!res) {
            throw new common_1.HttpException('Filter not found', common_1.HttpStatus.NOT_FOUND);
        }
        return res;
    }
    async executeFilterOnce(createDto, idx) {
        const criteria = await this.criteriaRepo.findOne({
            where: { idx: createDto.criteria, is_active: true },
        });
        if (!criteria) {
            throw new common_1.HttpException('The selected criteria not found', common_1.HttpStatus.NOT_FOUND);
        }
        const query = typeorm_2.getRepository(Customer_entity_1.Customer)
            .createQueryBuilder('customer')
            .where('customer.is_obsolete = :is_obsolete', {
            is_obsolete: false,
        })
            .andWhere('customer.employer_id = :id', { id: idx })
            .andWhere('customer.worker_status_type = UPPER(:active)', {
            active: 'active'.toUpperCase(),
        })
            .andWhere(`customer.${criteria.name} = :value`, {
            value: js_utils_1.autoParseValues(createDto.value),
        });
        return { count: await query.getCount() };
    }
    async upateFilter(updateDto, idx, employerIdx) {
        const filterExists = await this.searchFilterRepo.findOne({
            where: [
                { idx, is_obsolete: false, created_by: employerIdx },
                { idx, is_obsolete: false, is_default_filter: true },
            ],
        });
        if (!filterExists) {
            throw new common_1.HttpException('Filter with given Idx not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (filterExists.is_default_filter) {
            const serviceBusBodyDto = {
                idx: idx,
                employerIdx: employerIdx,
                is_active: updateDto.is_active,
                type: "default"
            };
            const serviceBusDto = {
                serviceType: 'update-filter-employee-auth',
                body: serviceBusBodyDto,
            };
            await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
            return { statusCode: 200, message: 'Operation successful' };
        }
        const checkFilterNameExists = await this.searchFilterRepo.findOne({
            where: {
                name: updateDto.name,
                idx: typeorm_2.Not(idx),
                is_obsolete: false,
                created_by: employerIdx,
            },
        });
        if (checkFilterNameExists) {
            throw new common_1.HttpException('Filter with name already exists', common_1.HttpStatus.CONFLICT);
        }
        if (updateDto.criteria) {
            const checkCriteraiExists = await this.criteriaRepo.findOne({
                where: {
                    idx: updateDto.criteria,
                    is_active: true,
                    is_obsolete: false,
                },
            });
            if (!checkCriteraiExists) {
                throw new common_1.HttpException('Criteria does not exist', common_1.HttpStatus.NOT_FOUND);
            }
            updateDto.criteria = checkCriteraiExists;
        }
        const serviceBusBodyDto = {
            idx: idx,
            employerIdx: employerIdx,
            updateDto: updateDto,
            type: ""
        };
        const serviceBusDto = {
            serviceType: 'update-filter-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Operation successful' };
    }
    async deleteFilter(idx, employerIdx) {
        const filterExists = await this.searchFilterRepo.findOne({
            where: { idx, is_obsolete: false, created_by: employerIdx },
        });
        if (!filterExists) {
            throw new common_1.HttpException('Filter with given Idx not found or is default filter', common_1.HttpStatus.NOT_FOUND);
        }
        if (filterExists.is_default_filter) {
            throw new common_1.HttpException('Cannot delete default filter', common_1.HttpStatus.BAD_REQUEST);
        }
        const serviceBusBodyDto = {
            idx: idx,
            employerIdx: employerIdx,
        };
        const serviceBusDto = {
            serviceType: 'delete-filter-employee-auth',
            body: serviceBusBodyDto,
        };
        await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
        return { statusCode: 200, message: 'Filter deleted' };
    }
};
EmployeeAuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Criterias_entity_1.Criterias)),
    __param(1, typeorm_1.InjectRepository(SearchFilters_entity_1.SearchFilters)),
    __param(2, typeorm_1.InjectRepository(Customer_entity_1.Customer)),
    __param(3, typeorm_1.InjectRepository(Protocol_entity_1.Protocol)),
    __param(4, typeorm_1.InjectRepository(OtpLog_entity_1.OtpLog)),
    __param(5, typeorm_1.InjectRepository(ActivityLog_entity_1.ActivityLog)),
    __param(8, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        service_bus_sender_service_1.ServiceBusSenderService,
        tokens_service_1.TokensService,
        common_2.Logger])
], EmployeeAuthService);
exports.EmployeeAuthService = EmployeeAuthService;
//# sourceMappingURL=employee-auth.service.js.map