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
const passport_1 = require("@nestjs/passport");
const user_operation_service_1 = require("./user-operation.service");
const user_operation_controller_1 = require("./user-operation.controller");
const typeorm_1 = require("@nestjs/typeorm");
const service_bus_sender_module_1 = require("../service-bus-sender/service-bus-sender.module");
const token_module_1 = require("../token/token.module");
const ActivityLog_entity_1 = require("../../entities/ActivityLog.entity");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const index_1 = require("../../config/index");
const Users_1 = require("../../entities/Users");
const UsersTemp_1 = require("../../entities/UsersTemp");
const UserType_1 = require("../../entities/UserType");
const Customer_entity_1 = require("../../entities/Customer.entity");
const WorkLog_entity_1 = require("../../entities/WorkLog.entity");
const WrongUserLog_1 = require("../../entities/WrongUserLog");
const InviteEmployerLog_1 = require("../../entities/InviteEmployerLog");
const UserTypeTemp_1 = require("../../entities/UserTypeTemp");
const Permission_1 = require("../../entities/Permission");
const PermissionUserType_1 = require("../../entities/PermissionUserType");
const PermissionUserTypeTemp_1 = require("../../entities/PermissionUserTypeTemp");
const CompanyUser_1 = require("../../entities/CompanyUser");
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
                WorkLog_entity_1.WorkLog,
                WrongUserLog_1.WrongUserLog,
                InviteEmployerLog_1.InviteEmployerLog,
                UserTypeTemp_1.UserTypeTemp,
                Permission_1.Permission,
                PermissionUserType_1.PermissionUserType,
                PermissionUserTypeTemp_1.PermissionUserTypeTemp,
                CompanyUser_1.CompanyUser
            ]),
            service_bus_sender_module_1.ServiceBusSenderModule,
            passport_1.PassportModule,
            common_1.HttpModule,
            token_module_1.TokenModule
        ],
        providers: [user_operation_service_1.UserOperationService],
        controllers: [user_operation_controller_1.UserOperationController],
    })
], UserOperationModule);
exports.UserOperationModule = UserOperationModule;
//# sourceMappingURL=user-operation.module.js.map