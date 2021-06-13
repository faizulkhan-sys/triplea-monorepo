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
exports.EmployeeAuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const nest_winston_1 = require("nest-winston");
const employee_auth_service_1 = require("./employee-auth.service");
const employee_auth_controller_1 = require("./employee-auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const service_bus_sender_module_1 = require("../service-bus-sender/service-bus-sender.module");
const token_module_1 = require("../token/token.module");
const SearchFilters_entity_1 = require("../../entities/SearchFilters.entity");
const Customer_entity_1 = require("../../entities/Customer.entity");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const OtpLog_entity_1 = require("../../entities/OtpLog.entity");
const ActivityLog_entity_1 = require("../../entities/ActivityLog.entity");
const Criterias_entity_1 = require("../../entities/Criterias.entity");
const index_1 = require("../../config/index");
let EmployeeAuthModule = class EmployeeAuthModule {
    constructor(logger) {
        this.logger = logger;
    }
};
EmployeeAuthModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Customer_entity_1.Customer,
                Protocol_entity_1.Protocol,
                OtpLog_entity_1.OtpLog,
                ActivityLog_entity_1.ActivityLog,
                SearchFilters_entity_1.SearchFilters,
                Criterias_entity_1.Criterias
            ]),
            service_bus_sender_module_1.ServiceBusSenderModule,
            passport_1.PassportModule,
            common_1.HttpModule,
            token_module_1.TokenModule
        ],
        providers: [employee_auth_service_1.EmployeeAuthService],
        controllers: [employee_auth_controller_1.EmployeeAuthController],
    }),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [common_1.Logger])
], EmployeeAuthModule);
exports.EmployeeAuthModule = EmployeeAuthModule;
//# sourceMappingURL=employee-auth.module.js.map