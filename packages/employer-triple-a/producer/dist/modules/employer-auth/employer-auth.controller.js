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
exports.EmployerAuthController = void 0;
const JwtGuard_1 = require("../../common/JwtGuard");
const SetPassword_dto_1 = require("../../dtos/SetPassword.dto");
const employerLogin_dto_1 = require("../../dtos/employerLogin.dto");
const ChangeUserPass_dto_1 = require("../../dtos/ChangeUserPass.dto");
const response_interface_1 = require("../../common/interfaces/response.interface");
const acessTokenResponse_interface_1 = require("../../common/interfaces/acessTokenResponse.interface");
const employer_auth_service_1 = require("./employer-auth.service");
const common_1 = require("@nestjs/common");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const captcha_1 = require("../../utils/captcha");
const GetUser_decorator_1 = require("../../common/GetUser.decorator");
const Users_1 = require("../../entities/Users");
const Derived_dto_2 = require("../../dtos/Derived.dto");
const operators_1 = require("rxjs/operators");
const BlockUnblock_dto_1 = require("../../dtos/BlockUnblock.dto");
const helpers_1 = require("../../utils/helpers");
const https = require("https");
const swagger_1 = require("@nestjs/swagger");
const validator_1 = require("validator");
const Permission_1 = require("../../entities/Permission");
const Protocol_1 = require("../../entities/Protocol");
const protocol_dto_1 = require("../../dtos/protocol.dto");
const create_setting_dto_1 = require("../../dtos/create-setting.dto");
let EmployerAuthController = class EmployerAuthController {
    constructor(authMasterService, httpService) {
        this.authMasterService = authMasterService;
        this.httpService = httpService;
    }
    async loginEmployer(employerLogin, req) {
        var _a;
        const ip = (req === null || req === void 0 ? void 0 : req.ip) || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) || req.get('x-forwarded-for');
        return await this.authMasterService.loginEmployer(employerLogin, ip);
    }
    async loginUser(userLogin, req) {
        var _a;
        const ip = (req === null || req === void 0 ? void 0 : req.ip) || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) || req.get('x-forwarded-for');
        return await this.authMasterService.loginUser(userLogin, ip);
    }
    async checkLink(token) {
        return await this.authMasterService.checkLink(token);
    }
    async SetPassword(passwordDto) {
        return await this.authMasterService.setPassword(passwordDto);
    }
    async getCaptcha() {
        return captcha_1.GetCAPTCHACode();
    }
    async getMappedRoutes(userRequesting) {
        return await this.authMasterService.listAllAccessibleAlias(userRequesting);
    }
    BlockUnblockUser(idx, userType, blockUnblock, req) {
        let rootUrl = process.env.CUSTOMER_SERVICE_BLOCKUNBLOCK;
        if (userType === 'merchant') {
            rootUrl = process.env.MERCHANT_SERVICE_BLOCKUNBLOCK;
        }
        return this.httpService
            .put(rootUrl + idx, { operation: blockUnblock.operation }, {
            headers: { Authorization: req.headers.authorization },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        })
            .pipe(operators_1.map(response => response.data), operators_1.catchError(helpers_1.handleError));
    }
    ResetMpin(idx, userType) {
        let rootUrl = process.env.CUSTOMER_SERVICE_MPIN_RESET;
        if (userType === 'merchant') {
            rootUrl = process.env.MERCHANT_SERVICE_MPIN_RESET;
        }
        return this.httpService
            .put(rootUrl + idx, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        })
            .pipe(operators_1.map(response => response.data), operators_1.catchError(helpers_1.handleError));
    }
    async getAllPermission(permission_type) {
        return await this.authMasterService.getAllPermission(permission_type);
    }
    async getMany() {
        return await this.authMasterService.getAllProtocol();
    }
    async findOne(userRequesting) {
        return await this.authMasterService.getSetting(userRequesting.idx);
    }
    async update(userRequesting, AddUpdateSettingDto) {
        return await this.authMasterService.addUpdateSettings(AddUpdateSettingDto, userRequesting.idx);
    }
    async forgotPassword(forgotPassword) {
        return await this.authMasterService.forgotPassword(forgotPassword);
    }
    async resetPassword(resetPassword) {
        return await this.authMasterService.resetPassword(resetPassword);
    }
    async changeUserPassword(passwords, user) {
        const idx = user.idx;
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return await this.authMasterService.changePassword(passwords, user.idx);
    }
    async updateProtocol(idx, protocolUpdate) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return await this.authMasterService.updateProtocol(idx, protocolUpdate);
    }
    async getOnePermissionByIdx(idx) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Bad idx value', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return await this.authMasterService.getPermissionByIdx(idx);
    }
};
__decorate([
    common_1.Post('employer/login'),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employerLogin_dto_1.EmployerLoginDto, Object]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "loginEmployer", null);
__decorate([
    common_1.Post('user/login'),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.UserLoginDto, Object]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "loginUser", null);
__decorate([
    common_1.Get('check-link/:token'),
    __param(0, common_1.Param('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "checkLink", null);
__decorate([
    common_1.Post('set-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetPassword_dto_1.SetPassword]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "SetPassword", null);
__decorate([
    common_1.Get('captcha'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "getCaptcha", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Get('mapped-routes'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "getMappedRoutes", null);
__decorate([
    common_1.Put('block-unblock/:userType/:idx'),
    __param(0, common_1.Param('idx')),
    __param(1, common_1.Param('userType')),
    __param(2, common_1.Body()),
    __param(3, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, BlockUnblock_dto_1.BlockUnblock, Object]),
    __metadata("design:returntype", void 0)
], EmployerAuthController.prototype, "BlockUnblockUser", null);
__decorate([
    common_1.Put('reset-mpin/:userType/:idx'),
    __param(0, common_1.Param('idx')), __param(1, common_1.Param('userType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EmployerAuthController.prototype, "ResetMpin", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Get all permission' }),
    swagger_1.ApiTags('Permission'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('all-permission'),
    __param(0, common_1.Query('permission_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "getAllPermission", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "getMany", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Get('get-settings'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "findOne", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Put('update-settings'),
    __param(0, GetUser_decorator_1.GetUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users,
        create_setting_dto_1.AddUpdatesettings]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "update", null);
__decorate([
    common_1.Post('forgot-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_1.ForgotPassword]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "forgotPassword", null);
__decorate([
    common_1.Put('reset-password'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_1.ResetPassword]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "resetPassword", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'change user password' }),
    common_1.Post('change-password'),
    __param(0, common_1.Body()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeUserPass_dto_1.ChangeUserPass,
        Users_1.Users]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "changeUserPassword", null);
__decorate([
    common_1.Put(':idx'),
    __param(0, common_1.Param('idx')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, protocol_dto_1.ProtocolUpdateDto]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "updateProtocol", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Get permission by idx' }),
    swagger_1.ApiTags('Permission'),
    common_1.Get(':idx'),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployerAuthController.prototype, "getOnePermissionByIdx", null);
EmployerAuthController = __decorate([
    common_1.Controller('employer-auth'),
    __metadata("design:paramtypes", [employer_auth_service_1.EmployerAuthService,
        common_1.HttpService])
], EmployerAuthController);
exports.EmployerAuthController = EmployerAuthController;
//# sourceMappingURL=employer-auth.controller.js.map