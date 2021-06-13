"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const employer_auth_service_1 = require("./employer-auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const ActivityLog_1 = require("../../entities/ActivityLog");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const OtpLog_1 = require("../../entities/OtpLog");
const EmailLog_1 = require("../../entities/EmailLog");
const PasswordHistoryLog_1 = require("../../entities/PasswordHistoryLog");
const Users_1 = require("../../entities/Users");
const EmployerSettings_entity_1 = require("../../entities/EmployerSettings.entity");
let EmployerAuthModule = class EmployerAuthModule {
};
EmployerAuthModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Protocol_entity_1.Protocol,
                ActivityLog_1.ActivityLog,
                OtpLog_1.OtpLog,
                EmailLog_1.EmailLog,
                PasswordHistoryLog_1.PasswordHistoryLog,
                Users_1.Users,
                EmployerSettings_entity_1.EmployerSettings
            ])
        ],
        providers: [employer_auth_service_1.EmployerAuthService],
        exports: [employer_auth_service_1.EmployerAuthService],
    })
], EmployerAuthModule);
exports.EmployerAuthModule = EmployerAuthModule;
//# sourceMappingURL=employer-auth.module.js.map