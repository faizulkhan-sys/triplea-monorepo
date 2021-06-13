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
exports.EmployerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const employer_auth_service_1 = require("./employer-auth.service");
const employer_auth_controller_1 = require("./employer-auth.controller");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const nest_winston_1 = require("nest-winston");
const typeorm_1 = require("@nestjs/typeorm");
const service_bus_sender_module_1 = require("../service-bus-sender/service-bus-sender.module");
const Protocol_1 = require("../../entities/Protocol");
const Users_1 = require("../../entities/Users");
const EmailLog_1 = require("../../entities/EmailLog");
const PasswordHistoryLog_1 = require("../../entities/PasswordHistoryLog");
const ActivityLog_1 = require("../../entities/ActivityLog");
const token_module_1 = require("../token/token.module");
const Permission_1 = require("../../entities/Permission");
const EmployerSettings_entity_1 = require("../../entities/EmployerSettings.entity");
const OtpLog_1 = require("../../entities/OtpLog");
const index_1 = require("../../config/index");
let EmployerAuthModule = class EmployerAuthModule {
    constructor(logger) {
        this.logger = logger;
    }
};
EmployerAuthModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Protocol_1.Protocol,
                Users_1.Users,
                EmailLog_1.EmailLog,
                PasswordHistoryLog_1.PasswordHistoryLog,
                Permission_1.Permission,
                EmployerSettings_entity_1.EmployerSettings,
                OtpLog_1.OtpLog,
                ActivityLog_1.ActivityLog
            ]),
            jwt_1.JwtModule.register({ secret: index_1.default.jwt.secret }),
            service_bus_sender_module_1.ServiceBusSenderModule,
            passport_1.PassportModule,
            common_1.HttpModule,
            token_module_1.TokenModule
        ],
        providers: [employer_auth_service_1.EmployerAuthService],
        controllers: [employer_auth_controller_1.EmployerAuthController],
    }),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [common_1.Logger])
], EmployerAuthModule);
exports.EmployerAuthModule = EmployerAuthModule;
//# sourceMappingURL=employer-auth.module.js.map