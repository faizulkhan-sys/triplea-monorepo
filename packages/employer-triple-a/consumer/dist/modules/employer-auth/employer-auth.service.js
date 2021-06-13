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
const helpers_1 = require("../../utils/helpers");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const status_enum_1 = require("../../common/constants/status.enum");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const ActivityLog_1 = require("../../entities/ActivityLog");
const OtpLog_1 = require("../../entities/OtpLog");
const EmailLog_1 = require("../../entities/EmailLog");
const PasswordHistoryLog_1 = require("../../entities/PasswordHistoryLog");
const Users_1 = require("../../entities/Users");
const helpers_2 = require("../../utils/helpers");
const EmployerSettings_entity_1 = require("../../entities/EmployerSettings.entity");
const typeorm_2 = require("typeorm");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
const logger = new common_1.Logger('Create Employee Login DB Writer');
let EmployerAuthService = class EmployerAuthService {
    constructor(usersRepo, protocolRepo, activityLogRepo, otpLogRepository, employerSettingsRepo, passwordHistoryRepo) {
        this.usersRepo = usersRepo;
        this.protocolRepo = protocolRepo;
        this.activityLogRepo = activityLogRepo;
        this.otpLogRepository = otpLogRepository;
        this.employerSettingsRepo = employerSettingsRepo;
        this.passwordHistoryRepo = passwordHistoryRepo;
    }
    async loginEmployerSaveActivity(data) {
        try {
            await this.activityLogRepo.save({
                ip_address: data.ip,
                device_id: '',
                login_type: 'WEB',
                login_status: false,
                user_id: data.user,
                activity_type: 'LOGIN',
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginEmployerUpdateActivity(data) {
        try {
            const updateLog = data.id;
            await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update(ActivityLog_1.ActivityLog)
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
    async loginUpdateUserAccount(data) {
        try {
            await this.usersRepo.update({ id: data.id }, { is_active: data.is_active });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginUserUpdateActivity(data) {
        try {
            let updateLog = data.id;
            await typeorm_2.getManager().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager
                    .createQueryBuilder()
                    .update(ActivityLog_1.ActivityLog)
                    .set({ is_obsolete: true })
                    .where({ id: typeorm_2.In(updateLog) })
                    .execute();
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async loginUserSaveActivity(data) {
        try {
            await this.activityLogRepo.save({
                ip_address: data.ip,
                device_id: '',
                login_type: 'WEB',
                login_status: false,
                user_id: data.user,
                activity_type: 'LOGIN',
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async setPassword(data) {
        try {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.update(Users_1.Users, { idx: data.idx }, { password: data.password });
                await transactionalEntityManager.update(EmailLog_1.EmailLog, { token: data.token }, { is_active: false });
                await transactionalEntityManager.save(PasswordHistoryLog_1.PasswordHistoryLog, {
                    password: data.password,
                    user_id: data.user_id,
                });
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProtocol(data) {
        try {
            let idx = data.idx;
            await this.protocolRepo.update({ idx }, data.protocolUpdate);
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSettings(data) {
        try {
            if (!data.settings) {
                await this.employerSettingsRepo.save(Object.assign(Object.assign({}, data.settingsDto), { created_by: data.idx }));
            }
            else {
                await this.employerSettingsRepo.update({ created_by: data.idx }, data.settingsDto);
            }
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async forgotPassword(data) {
        let otp_code = data.otp_code;
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
                        .update(OtpLog_1.OtpLog)
                        .set({ is_active: false, is_obsolete: true })
                        .where({ id: typeorm_2.In(idsToUpdate) })
                        .execute();
                });
            }
            await this.otpLogRepository.save(data.otpLog);
            const mailData = {
                "otp_code": otp_code,
                "first_name": data.name,
                "operation": "reset password"
            };
            console.log('Mail Data to send');
            console.log(JSON.stringify(mailData));
            await helpers_2.sendMail('Orbis', data.email, 'reset', mailData, 'Otp for forgot password');
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(data) {
        try {
            await typeorm_2.getConnection().transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.update(OtpLog_1.OtpLog, { otp_code: data.otp_code }, { is_active: false });
                await transactionalEntityManager.update(Users_1.Users, { id: data.id }, { password: data.password, is_active: true });
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async changePassword(data) {
        try {
            await this.usersRepo.update({ idx: data.user_id.idx }, { password: data.password });
            await this.passwordHistoryRepo.save({
                password: data.password,
                user_id: data.userExists,
            });
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
EmployerAuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(Users_1.Users)),
    __param(1, typeorm_1.InjectRepository(Protocol_entity_1.Protocol)),
    __param(2, typeorm_1.InjectRepository(ActivityLog_1.ActivityLog)),
    __param(3, typeorm_1.InjectRepository(OtpLog_1.OtpLog)),
    __param(4, typeorm_1.InjectRepository(EmployerSettings_entity_1.EmployerSettings)),
    __param(5, typeorm_1.InjectRepository(PasswordHistoryLog_1.PasswordHistoryLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EmployerAuthService);
exports.EmployerAuthService = EmployerAuthService;
//# sourceMappingURL=employer-auth.service.js.map