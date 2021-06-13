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
exports.UserOperationController = void 0;
const JwtGuard_1 = require("../../common/JwtGuard");
const response_interface_1 = require("../../common/interfaces/response.interface");
const wronguser_dto_1 = require("../../dtos/wronguser.dto");
const user_operation_service_1 = require("./user-operation.service");
const Derived_dto_1 = require("../../dtos/Derived.dto");
const Notify_dto_1 = require("../../dtos/Notify.dto");
const ListQuery_dto_1 = require("../../dtos/ListQuery.dto");
const UpdateUser_dto_1 = require("../../dtos/UpdateUser.dto");
const CreateUser_dto_1 = require("../../dtos/CreateUser.dto");
const EnableDisabledto_1 = require("../../dtos/EnableDisabledto");
const AppproverReject_dto_1 = require("../../dtos/AppproverReject.dto");
const fcm_dto_1 = require("../../dtos/fcm.dto");
const CreateUserType_dto_1 = require("../../dtos/CreateUserType.dto");
const UpdateUserTypeName_dto_1 = require("../../dtos/UpdateUserTypeName.dto");
const UpdateUserTypePermission_dto_1 = require("../../dtos/UpdateUserTypePermission.dto");
const common_1 = require("@nestjs/common");
const GetUser_decorator_1 = require("../../common/GetUser.decorator");
const Users_1 = require("../../entities/Users");
const Derived_dto_2 = require("../../dtos/Derived.dto");
const helpers_1 = require("../../utils/helpers");
const swagger_1 = require("@nestjs/swagger");
const validator_1 = require("validator");
const Customer_entity_1 = require("../../entities/Customer.entity");
let UserOperationController = class UserOperationController {
    constructor(userOpsService, httpService) {
        this.userOpsService = userOpsService;
        this.httpService = httpService;
    }
    async getEmployerByName(query) {
        if (query === '') {
            return [];
        }
        return this.userOpsService.getEmployerByName(query);
    }
    async getEmployerByZip(query) {
        if (!query || query === '') {
            throw new common_1.HttpException('Query cannot be empty', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.userOpsService.getEmployerByZip(query);
    }
    async wrongUserFound(wrongUser) {
        return this.userOpsService.wrongUserFound(wrongUser);
    }
    async getEmployerByIdx(idx) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Bad idx value', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.getUserByIdx(idx);
    }
    async contactMe(contactMe) {
        return this.userOpsService.contactMe(contactMe.employer_email);
    }
    async invitemeployerMobile(userData) {
        return this.userOpsService.inviteEmployerMobile(userData);
    }
    async setNotificationForEmployee(userData) {
        return this.userOpsService.setNotification(userData);
    }
    async getAllPendingUsers(listQuery, userRequesting) {
        return this.userOpsService.getAllPendingUsers(listQuery, userRequesting);
    }
    async GetPendingCustomerByIdx(idx) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.userOpsService.getAPendingUser(idx);
    }
    async createUser(userData, userRequesting) {
        return this.userOpsService.createUser(userData, userRequesting);
    }
    async deleteUser(idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.deleteUser(idx, userRequesting);
    }
    async changeUserStatus(approveReject, idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.verifyUserOperation(approveReject, idx, userRequesting);
    }
    async enableDisableUser(enableDisable, idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.enableDisable(enableDisable.operation, idx, userRequesting);
    }
    async calculateWage(employee) {
        return this.userOpsService.calculateWage(employee.idx, employee.employer_id);
    }
    async employeeStatus(employee) {
        return this.userOpsService.employeeStatus(employee.idx);
    }
    async totalHoursWorked(employee) {
        return this.userOpsService.hoursWorked(employee);
    }
    async idEmployee(idEmployee) {
        return this.userOpsService.idEmployee(idEmployee);
    }
    async checkEmail(emailDto) {
        return this.userOpsService.checkEmail(emailDto);
    }
    async employeeMobile(idx) {
        helpers_1.validateUUID(idx);
        return this.userOpsService.getAllCustomerByIdx(idx);
    }
    async setFcm(employee, fcmDto) {
        return this.userOpsService.setFcm(employee.idx, fcmDto.fcm_key, fcmDto.platform);
    }
    async requestSaFeature(employee) {
        return this.userOpsService.requestSaFeature(employee.idx);
    }
    async addMobileNumber(addNumber, employee) {
        console.log("***************employee from add mobile");
        console.log(employee);
        return this.userOpsService.addorChangeMobileNumber(employee.idx, addNumber, 'ADD_NUMBER');
    }
    async changeMobileNumber(changeNumber, employee) {
        return this.userOpsService.addorChangeMobileNumber(employee.idx, changeNumber, 'CHANGE_NUMBER');
    }
    async resetUser(employee) {
        return this.userOpsService.resetUser(employee);
    }
    getAlluserType(listUserType) {
        return this.userOpsService.getAllUserType(listUserType);
    }
    async GetAllPendingRoles(listPendingDto, userRequesting) {
        return this.userOpsService.getAllPendingUserType(listPendingDto, userRequesting);
    }
    async getPendingUserTypeByIdx(idx) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.userOpsService.getPendingUserTypeByIdx(idx);
    }
    async getOneByIdx(idx) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Bad idx value', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.getAUserType(idx);
    }
    async createUserType(dto, userRequesting) {
        return this.userOpsService.createUsertype(dto, userRequesting);
    }
    async deleteUserType(idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.deleteUserType(idx, userRequesting);
    }
    async updateUserTypeName(userType, idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.updateUserTypeName(userType, idx, userRequesting);
    }
    async changeUserTypeStatus(approveReject, idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.VerifyUserType(approveReject, idx, userRequesting);
    }
    async updateUserTypePermissions(userType, idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.updateUserTypePermissions(userType, idx, userRequesting);
    }
    async updateUser(user, idx, userRequesting) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.updateUser(user, idx, userRequesting);
    }
    async getAllUser(listQuery) {
        return this.userOpsService.getAllUsers(listQuery);
    }
    async getUserByIdx(idx) {
        if (!validator_1.default.isUUID(idx, 'all')) {
            throw new common_1.HttpException('Bad idx value', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return this.userOpsService.getUserByIdx(idx);
    }
};
__decorate([
    common_1.Get('search-employer'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Query('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getEmployerByName", null);
__decorate([
    swagger_1.ApiOperation({ description: 'get employer by state/zip' }),
    common_1.Get('get-employer'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Query('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getEmployerByZip", null);
__decorate([
    swagger_1.ApiOperation({ description: 'wrong user found' }),
    common_1.Post('wrong-user-info'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wronguser_dto_1.WrongUserFound]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "wrongUserFound", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Get a user by idx' }),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('get-employer/:idx'),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getEmployerByIdx", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Get a user by idx' }),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Post('contactme'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_1.ContactMe]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "contactMe", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Register a new employer from mobile' }),
    common_1.Post('invite-employer'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_1.InviteUserMobile]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "invitemeployerMobile", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Notify an employee' }),
    common_1.Put('notify-employee'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Notify_dto_1.NotifyDto]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "setNotificationForEmployee", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('/pending'),
    __param(0, common_1.Query()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListQuery_dto_1.ListPendingDto,
        Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getAllPendingUsers", null);
__decorate([
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('pending/:idx'),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "GetPendingCustomerByIdx", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Create a new user' }),
    common_1.Post(),
    __param(0, common_1.Body()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUser_dto_1.CreateUser,
        Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "createUser", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Delete a user' }),
    common_1.Delete(':idx'),
    __param(0, common_1.Param('idx')),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "deleteUser", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Verify User' }),
    swagger_1.ApiTags('User'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Put('verify/:idx'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idx')),
    __param(2, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AppproverReject_dto_1.ApproveRejectDto, String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "changeUserStatus", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Enable/disable User' }),
    swagger_1.ApiTags('User'),
    common_1.Put('enable-disable/:idx'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idx')),
    __param(2, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EnableDisabledto_1.EnableDisable, String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "enableDisableUser", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('wage'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "calculateWage", null);
__decorate([
    swagger_1.ApiOperation({ description: 'get employee status' }),
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Get('employee-status'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "employeeStatus", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('hours-worked'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "totalHoursWorked", null);
__decorate([
    swagger_1.ApiOperation({ description: 'id employee' }),
    common_1.Post('id-employee'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.IdEmployeeDto]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "idEmployee", null);
__decorate([
    swagger_1.ApiOperation({ description: 'check employee email' }),
    common_1.Post('check-email'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.CheckEmail]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "checkEmail", null);
__decorate([
    swagger_1.ApiOperation({ description: 'get employee idx' }),
    common_1.Get('employee/:idx'),
    __param(0, common_1.Param(':idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "employeeMobile", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Set fcm for an employee' }),
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Put('fcm'),
    __param(0, GetUser_decorator_1.GetUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer,
        fcm_dto_1.FcmDto]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "setFcm", null);
__decorate([
    swagger_1.ApiOperation({ description: 'get employee idx' }),
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Put('sa-activate'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "requestSaFeature", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Add phone number' }),
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Put('add-mobile'),
    __param(0, common_1.Body()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.AddOrChangeNumber,
        Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "addMobileNumber", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Change phone number' }),
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Put('change-mobile'),
    __param(0, common_1.Body()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Derived_dto_2.AddOrChangeNumber,
        Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "changeMobileNumber", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Put('reset-user'),
    __param(0, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Customer_entity_1.Customer]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "resetUser", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('usertype'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListQuery_dto_1.ListActiveUserTypeDto]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getAlluserType", null);
__decorate([
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('usertype/pending'),
    __param(0, common_1.Query()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListQuery_dto_1.ListPendingDto,
        Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "GetAllPendingRoles", null);
__decorate([
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Get('usertype/pending/:idx'),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getPendingUserTypeByIdx", null);
__decorate([
    common_1.Get('usertype/:idx'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getOneByIdx", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Post('usertype'),
    __param(0, common_1.Body()),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserType_dto_1.CreateUserType,
        Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "createUserType", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    common_1.Delete('usertype/:idx'),
    __param(0, common_1.Param('idx')),
    __param(1, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "deleteUserType", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Update a Role Name' }),
    swagger_1.ApiTags('Role'),
    common_1.Put('usertype/name/:idx'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idx')),
    __param(2, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserTypeName_dto_1.UpdateUserTypeName, String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "updateUserTypeName", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Verify UserType' }),
    swagger_1.ApiTags('UserType'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.Put('usertype/verify/:idx'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idx')),
    __param(2, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AppproverReject_dto_1.ApproveRejectDto, String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "changeUserTypeStatus", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Update a Role Name' }),
    swagger_1.ApiTags('Role'),
    common_1.Put('usertype/permission/:idx'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idx')),
    __param(2, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserTypePermission_dto_1.UpdateUserTypePermissions, String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "updateUserTypePermissions", null);
__decorate([
    common_1.UseGuards(JwtGuard_1.JwtAuthGuard),
    swagger_1.ApiOperation({ description: 'Update a new user' }),
    common_1.Put(':idx'),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('idx')),
    __param(2, GetUser_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUser_dto_1.UpdateUser, String, Users_1.Users]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "updateUser", null);
__decorate([
    swagger_1.ApiOperation({ description: ' all users' }),
    common_1.Get(),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListQuery_dto_1.ListActiveUserDto]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getAllUser", null);
__decorate([
    swagger_1.ApiOperation({ description: 'Get a user by idx' }),
    common_1.Get(':idx'),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    __param(0, common_1.Param('idx')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOperationController.prototype, "getUserByIdx", null);
UserOperationController = __decorate([
    common_1.Controller('user-operation'),
    __metadata("design:paramtypes", [user_operation_service_1.UserOperationService,
        common_1.HttpService])
], UserOperationController);
exports.UserOperationController = UserOperationController;
//# sourceMappingURL=user-operation.controller.js.map