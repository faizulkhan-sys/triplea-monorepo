"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeOrmConfig = require("./typeorm.config");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const typeorm_1 = require("@nestjs/typeorm");
const winstonTransports_1 = require("./utils/winstonTransports");
const core_1 = require("@nestjs/core");
const logger_interceptor_1 = require("./common/interceptor/logger.interceptor");
const service_bus_receiver_module_1 = require("./modules/service-bus-receiver/service-bus-receiver.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            service_bus_receiver_module_1.ServiceBusReceiverModule,
            nest_winston_1.WinstonModule.forRoot({
                format: winston.format.combine(winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }), winston.format.errors({ stack: true }), winston.format.splat(), winston.format.json()),
                defaultMeta: { service: 'EmployeeAuthDBWriter' },
                transports: winstonTransports_1.default,
                exceptionHandlers: [
                    new winston.transports.File({
                        filename: 'logs/exceptions.log',
                    }),
                ],
            }),
            typeorm_1.TypeOrmModule.forRoot(typeOrmConfig),
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logger_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map