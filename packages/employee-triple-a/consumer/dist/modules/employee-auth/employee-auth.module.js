"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAuthModule = void 0;
const common_1 = require("@nestjs/common");
const employee_auth_service_1 = require("./employee-auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const Customer_entity_1 = require("../../entities/Customer.entity");
const ActivityLog_entity_1 = require("../../entities/ActivityLog.entity");
const Protocol_entity_1 = require("../../entities/Protocol.entity");
const OtpLog_entity_1 = require("../../entities/OtpLog.entity");
const SearchFilters_entity_1 = require("../../entities/SearchFilters.entity");
let EmployeeAuthModule = class EmployeeAuthModule {
};
EmployeeAuthModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Customer_entity_1.Customer,
                Protocol_entity_1.Protocol,
                ActivityLog_entity_1.ActivityLog,
                OtpLog_entity_1.OtpLog,
                SearchFilters_entity_1.SearchFilters
            ]),
        ],
        providers: [employee_auth_service_1.EmployeeAuthService],
        exports: [employee_auth_service_1.EmployeeAuthService],
    })
], EmployeeAuthModule);
exports.EmployeeAuthModule = EmployeeAuthModule;
//# sourceMappingURL=employee-auth.module.js.map