"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperationModule = void 0;
const common_1 = require("@nestjs/common");
const user_operation_service_1 = require("./user-operation.service");
const typeorm_1 = require("@nestjs/typeorm");
const Customer_entity_1 = require("../../entities/Customer.entity");
const ActivityLog_entity_1 = require("../../entities/ActivityLog.entity");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const token_module_1 = require("../token/token.module");
const Users_1 = require("../../entities/Users");
const UsersTemp_1 = require("../../entities/UsersTemp");
const UserType_1 = require("../../entities/UserType");
const CompanyUser_1 = require("../../entities/CompanyUser");
const WrongUserLog_1 = require("../../entities/WrongUserLog");
const InviteEmployerLog_1 = require("../../entities/InviteEmployerLog");
const UserTypeTemp_1 = require("../../entities/UserTypeTemp");
const Permission_1 = require("../../entities/Permission");
const PermissionUserTypeTemp_1 = require("../../entities/PermissionUserTypeTemp");
const PermissionUserType_1 = require("../../entities/PermissionUserType");
let UserOperationModule = class UserOperationModule {
};
UserOperationModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Customer_entity_1.Customer,
                Protocol_entity_1.Protocol,
                ActivityLog_entity_1.ActivityLog,
                Users_1.Users,
                UsersTemp_1.UsersTemp,
                UserType_1.UserType,
                CompanyUser_1.CompanyUser,
                WrongUserLog_1.WrongUserLog,
                InviteEmployerLog_1.InviteEmployerLog,
                UserTypeTemp_1.UserTypeTemp,
                Permission_1.Permission,
                PermissionUserTypeTemp_1.PermissionUserTypeTemp,
                PermissionUserType_1.PermissionUserType
            ]),
            token_module_1.TokenModule
        ],
        providers: [user_operation_service_1.UserOperationService],
        exports: [user_operation_service_1.UserOperationService]
    })
], UserOperationModule);
exports.UserOperationModule = UserOperationModule;
//# sourceMappingURL=user-operation.module.js.map