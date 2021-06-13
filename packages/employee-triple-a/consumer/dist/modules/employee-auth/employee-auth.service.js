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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const status_enum_1 = require("../../common/constants/status.enum");
const Customer_entity_1 = require("../../entities/Customer.entity");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const ActivityLog_entity_1 = require("../../entities/ActivityLog.entity");
const OtpLog_entity_1 = require("../../entities/OtpLog.entity");
const helpers_2 = require("../../utils/helpers");
const dbHelpers_1 = require("../../utils/dbHelpers");
const index_1 = require("../../config/index");
const employeeLogin_dto_1 = require("../../dtos/employeeLogin.dto");
const typeorm_2 = require("typeorm");
const SearchFilters_entity_1 = require("../../entities/SearchFilters.entity");
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
const logger = new common_1.Logger('Create Employee Login DB Writer');
let EmployeeAuthService = class EmployeeAuthService {
    constructor(searchFilterRepo, customerRepository, protocolRepo, activityLogRepo, otpLogRepository) {
        this.searchFilterRepo = searchFilterRepo;
        this.customerRepository = customerRepository;
        this.protocolRepo = protocolRepo;
        this.activityLogRepo = activityLogRepo;
        this.otpLogRepository = otpLogRepository;
    }
    async loginEmployeeSaveActivity(data) {
        try {
            await this.activityLogRepo.save({
                ip_address: '',
                device_id: '',
                login_type: 'MOBILE',
                login_status: true,
                user: data.user,
                activity_type: 'LOGIN',
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginEmployeeSaveActivityForFailed(data) {
        try {
            await this.activityLogRepo.save({
                ip_address: '',
                device_id: '',
                login_type: 'MOBILE',
                login_status: false,
                status: false,
                user: data.user,
                activity_type: 'LOGIN',
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginEmployeeUpdateActivity(data) {
        try {
            const updateLog = data.id;
            await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update(ActivityLog_entity_1.ActivityLog)
                    .set({ is_obsolete: data.is_obsolete })
                    .where({ id: typeorm_2.In(updateLog) })
                    .execute();
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginUpdateEmployeeAccount(data) {
        try {
            await this.customerRepository.update({ id: data.id }, { is_active: data.is_active });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetMpin(data) {
        try {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.update(OtpLog_entity_1.OtpLog, { otp_code: data.otp_code }, { is_active: false });
                await transactionalEntityManager.update(Customer_entity_1.Customer, { id: data.id }, { mpin: data.mpin });
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async forgetMpin(data) {
        const otp_code = data.otp_code;
        try {
            await this.otpLogRepository.save(data);
            const mailData = {
                "otp_code": otp_code,
                "first_name": data.user.first_name,
                "operation": 'reset mpin'
            };
            await helpers_2.sendMail(data.user.email, 'reset', mailData, 'Otp for forgot mpin');
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async changeMpin(data) {
        try {
            await this.customerRepository.update({ idx: data.idx }, { mpin: data.new_mpin });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async changePassword(data) {
        try {
            await this.customerRepository.update({ idx: data.idx }, { password: data.password });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(data) {
        try {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.update(OtpLog_entity_1.OtpLog, { otp_code: data.otp_code }, { is_active: false });
                await transactionalEntityManager.update(Customer_entity_1.Customer, { id: data.id }, { password: data.password, is_active: true });
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyMpin(data) {
        if (data.activity_type === 'DEACTIVATE') {
            try {
                console.log("Deactivating account");
                await typeorm_2.getConnection()
                    .getRepository(Customer_entity_1.Customer)
                    .update({ id: data.customer.id }, { is_active: false });
            }
            catch (err) {
                logger.error(err);
                throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            try {
                await dbHelpers_1.checkForFailedMpin(data.customer, data.device, data.ip, data.login_type, data.activity_type);
            }
            catch (err) {
                logger.error(err);
                throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async setMpin(data) {
        try {
            await this.customerRepository.update({ idx: data.idx }, { is_mpin_set: true, mpin: data.mpin });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async forgotPassword(data) {
        let otp_code = data.data.otp_code;
        try {
            const optLogArray = await this.otpLogRepository.find({
                where: {
                    user: data.otpLog.user,
                    is_active: true,
                },
                relations: ['user']
            });
            if (optLogArray && Array.isArray(optLogArray) && optLogArray.length > 0) {
                let idsToUpdate = [];
                optLogArray.forEach(elm => {
                    idsToUpdate.push(elm.id);
                });
                console.log('IDs to Update otplog ---> ' + idsToUpdate);
                await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager
                        .createQueryBuilder()
                        .update(OtpLog_entity_1.OtpLog)
                        .set({ is_active: false, is_obsolete: true })
                        .where({ id: typeorm_2.In(idsToUpdate) })
                        .execute();
                });
            }
            await this.otpLogRepository.save(data.otpLog);
            const mailData = {
                otp_code,
                email: data.data.email,
                name: data.data.first_name,
                operation: 'reset password',
            };
            await helpers_2.sendMail(data.data.email, 'reset', mailData, 'Otp for forgot password');
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async signupEmployee(data) {
        try {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                transactionalEntityManager.update(Customer_entity_1.Customer, { idx: data.signUpDto.idx }, {
                    password: data.password,
                    is_password_set: true,
                    email: data.signUpDto.email,
                    is_registered: true,
                    sort_order: 2,
                    is_first_time_import: false,
                });
                await transactionalEntityManager.getRepository(ActivityLog_entity_1.ActivityLog).save({
                    ip_address: '',
                    device_id: '',
                    login_type: 'MOBILE',
                    login_status: true,
                    user: data.checkIdxExists,
                    activity_type: 'LOGIN',
                });
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createFilter(data) {
        try {
            await this.searchFilterRepo.save(data.searchFilter);
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async upadateFilter(data) {
        try {
            if (data.type === 'default') {
                const idx = data.idx;
                const employerIdx = data.employerIdx;
                const is_active = data.is_active;
                await this.searchFilterRepo.update({ idx, created_by: employerIdx }, { is_active: is_active });
            }
            else {
                const idx = data.idx;
                const employerIdx = data.employerIdx;
                const updateDto = data.updateDto;
                await this.searchFilterRepo.update({ idx, created_by: employerIdx }, updateDto);
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteFilter(data) {
        try {
            const idx = data.idx;
            const employerIdx = data.employerIdx;
            await this.searchFilterRepo.update({ idx, is_obsolete: false, created_by: employerIdx }, { is_obsolete: true });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
EmployeeAuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(SearchFilters_entity_1.SearchFilters)),
    __param(1, typeorm_1.InjectRepository(Customer_entity_1.Customer)),
    __param(2, typeorm_1.InjectRepository(Protocol_entity_1.Protocol)),
    __param(3, typeorm_1.InjectRepository(ActivityLog_entity_1.ActivityLog)),
    __param(4, typeorm_1.InjectRepository(OtpLog_entity_1.OtpLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeeAuthService);
exports.EmployeeAuthService = EmployeeAuthService;
//# sourceMappingURL=employee-auth.service.js.map