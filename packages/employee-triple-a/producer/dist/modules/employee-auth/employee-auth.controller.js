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
exports.EmployeeAuthController = void 0;
const GetUser_1 = require("../../common/decorators/GetUser");
const JwtGuard_1 = require("../../common/guards/JwtGuard");
const response_interface_1 = require("../../common/interfaces/response.interface");
const employeeLogin_dto_1 = require("../../dtos/employeeLogin.dto");
const tokens_service_1 = require("../token/tokens.service");
const employee_auth_service_1 = require("./employee-auth.service");
const Customer_entity_1 = require("../../entities/Customer.entity");
const swagger_1 = require("@nestjs/swagger");
const GetIdx_1 = require("../../common/decorators/GetIdx");
const ListQuery_dto_1 = require("../../dtos/ListQuery.dto");
const AddFilter_1 = require("../../dtos/AddFilter");
const helpers_1 = require("../../utils/helpers");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const UpdateFilter_1 = require("../../dtos/UpdateFilter");
const Derived_dto_2 = require("../../dtos/Derived.dto");
const common_1 = require("@nestjs/common");
let EmployeeAuthController = class EmployeeAuthController {
    constructor(employeeAuthService, tokenService) {
        this.employeeAuthService = employeeAuthService;
        this.tokenService = tokenService;
    }
    async login(emplLogin) {
        const response = await this.employeeAuthService.loginEmployee(emplLogin);
        return response;
    }
    async resetMpin(resetMpinDto) {
        return this.employeeAuthService.resetMpin(resetMpinDto);
    }
    async forgetMpin(employee) {
        return this.employeeAuthService.forgetMpin(employee);
    }
    async changeMpin(employee, mpinDto) {
        return this.employeeAuthService.changeMpin(employee, mpinDto);
    }
    async changePassword(changePassword, employee) {
        return this.employeeAuthService.changePassword(changePassword, employee);
    }
    async resetPassword(resetPassword) {
        return this.employeeAuthService.resetPassword(resetPassword);
    }
    async verifyMpin(employee, mpinDto) {
        return this.employeeAuthService.verifyMpin(employee, mpinDto);
    }
    async setMpin(employee, mpinDto) {
        return this.employeeAuthService.setMpin(employee, mpinDto);
    }
    async verifyOtp(otp) {
        return this.employeeAuthService.verifyOtp(otp.otp_code);
    }
    async forgotPassword(forgotPassword) {
        return this.employeeAuthService.forgotPassword(forgotPassword);
    }
    async refresh(body) {
        const { token, } = await this.tokenService.createAccessTokenFromRefreshToken(body.refresh_token);
        return {
            message: 'Operation Successful',
            access_token: token,
        };
    }
    async signUpEmployee(signupDto) {
        return this.employeeAuthService.signupEmployee(signupDto);
    }
    async logout(employee, refreshToken, fromAll = false) {
        if (fromAll) {
            return this.employeeAuthService.logoutFromAll(employee);
        }
        else {
            return this.employeeAuthService.logout(employee, refreshToken.refresh_token);
        }
    }
    async chnage(idx) {
        return this.employeeAuthService.changePasswordIdx(idx);
    }
};
__decorate([
    common_1.Post('login'),
    common_1.Header('content-type', 'application/json'),
    swagger_1.ApiOperation({ description: 'Employee Login' }),
    swagger_1.ApiBody({ type: employeeLogin_dto_1.EmployeeLoginDto }),
    swagger_1.ApiCreatedResponse({ description: "Successfully signed in" }),
    swagger_1.ApiUnauthorizedResponse({ description: "Invalid credentials" }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employeeLogin_dto_1.EmployeeLoginDto]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "login", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Reset Mpin' }),
    swagger_1.ApiOkResponse({ description: "Mpin updated successfully" }),
    swagger_1.ApiBody({ type: Derived_dto_2.ResetMpin }),
    common_1.Put('reset-mpin'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.ResetMpin]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "resetMpin", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Forgot Mpin' }),
    swagger_1.ApiOkResponse({ description: "Email Send for code" }),
    common_1.Put('forgot-mpin'),
    __param(0, GetUser_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "forgetMpin", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Change Mpin' }),
    swagger_1.ApiOkResponse({ description: "Mpin Changed successfully" }),
    swagger_1.ApiBody({ type: Derived_dto_2.ChangeMpin }),
    common_1.Put('change-mpin'),
    __param(0, GetUser_1.GetUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer,
        Derived_dto_2.ChangeMpin]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "changeMpin", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Change Password' }),
    swagger_1.ApiOkResponse({ description: "Password Updated" }),
    swagger_1.ApiBody({ type: Derived_dto_2.ChangePassword }),
    common_1.Put('change-password'),
    __param(0, common_1.Body()),
    __param(1, GetUser_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.ChangePassword,
        Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "changePassword", null);
__decorate([
    common_1.Put('reset-password'),
    swagger_1.ApiOperation({ description: 'Reset Password' }),
    swagger_1.ApiOkResponse({ description: "Password updated successfully" }),
    swagger_1.ApiBody({ type: Derived_dto_2.ResetPassword }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.ResetPassword]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "resetPassword", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Verify Mpin' }),
    swagger_1.ApiOkResponse({ description: "Mpin verified" }),
    swagger_1.ApiBody({ type: Derived_dto_2.SetMpin }),
    common_1.Post('verify-mpin'),
    __param(0, GetUser_1.GetUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer,
        Derived_dto_2.SetMpin]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "verifyMpin", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Set Mpin' }),
    swagger_1.ApiOkResponse({ description: "Mpin successfully set." }),
    swagger_1.ApiBody({ type: Derived_dto_2.SetMpin }),
    common_1.Put('mpin'),
    __param(0, GetUser_1.GetUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer,
        Derived_dto_2.SetMpin]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "setMpin", null);
__decorate([
    common_1.Post('verify-otp'),
    swagger_1.ApiOperation({ description: 'Verify OTP' }),
    swagger_1.ApiOkResponse({ description: "OTP verified" }),
    swagger_1.ApiBody({ type: Derived_dto_2.OtpDto }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.OtpDto]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "verifyOtp", null);
__decorate([
    common_1.Post('forgot-password'),
    swagger_1.ApiOperation({ description: 'Forgot Password' }),
    swagger_1.ApiOkResponse({ description: "Email Send for code" }),
    swagger_1.ApiBody({ type: Derived_dto_2.ForgotPassword }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.ForgotPassword]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "forgotPassword", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Token Refresh' }),
    swagger_1.ApiOkResponse({ description: "Get a new access token" }),
    swagger_1.ApiBody({ type: Derived_dto_2.RefreshRequest }),
    common_1.Post('token/refresh'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.RefreshRequest]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "refresh", null);
__decorate([
    swagger_1.ApiOperation({ description: 'signup employee' }),
    common_1.Post('signup'),
    swagger_1.ApiOperation({ description: 'Signup Employee' }),
    swagger_1.ApiOkResponse({ description: "Employee signup successful" }),
    swagger_1.ApiBody({ type: Derived_dto_2.SignUpEmployee }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.SignUpEmployee]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "signUpEmployee", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Logout Employee' }),
    swagger_1.ApiOkResponse({ description: "Employee logout successful" }),
    swagger_1.ApiBody({ type: Derived_dto_2.RefreshRequest }),
    common_1.Post('logout'),
    __param(0, GetUser_1.GetUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Query('from_all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer,
        Derived_dto_2.RefreshRequest, Object]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "logout", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ description: 'Changed password' }),
    swagger_1.ApiOkResponse({ description: "Change password done" }),
    common_1.Get('/changepwd/:idx'),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeAuthController.prototype, "chnage", null);
EmployeeAuthController = __decorate([
    common_1.Controller('employee-auth'),
    __metadata("design:paramtypes", [employee_auth_service_1.EmployeeAuthService,
        tokens_service_1.TokensService])
], EmployeeAuthController);
exports.EmployeeAuthController = EmployeeAuthController;
//# sourceMappingURL=employee-auth.controller.js.map