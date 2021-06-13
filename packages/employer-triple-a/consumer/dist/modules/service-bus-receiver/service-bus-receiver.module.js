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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBusReceiverModule = void 0;
const employer_auth_module_1 = require("../employer-auth/employer-auth.module");
const common_1 = require("@nestjs/common");
const service_bus_receiver_service_1 = require("./service-bus-receiver.service");
let ServiceBusReceiverModule = class ServiceBusReceiverModule {
    constructor(serviceBusReceiverService) {
        this.serviceBusReceiverService = serviceBusReceiverService;
    }
    onModuleInit() {
        const logger = new common_1.Logger('Service Bus Receiver On Init Module for Queue');
        logger.log('Service Bus Receiver On Init Module');
        logger.log('Initialization...');
        try {
            this.serviceBusReceiverService.receiveMessageAsync();
        }
        catch (err) {
            logger.error(err);
        }
    }
};
ServiceBusReceiverModule = __decorate([
    common_1.Module({
        imports: [employer_auth_module_1.EmployerAuthModule],
        providers: [service_bus_receiver_service_1.ServiceBusReceiverService],
    }),
    __metadata("design:paramtypes", [service_bus_receiver_service_1.ServiceBusReceiverService])
], ServiceBusReceiverModule);
exports.ServiceBusReceiverModule = ServiceBusReceiverModule;
//# sourceMappingURL=service-bus-receiver.module.js.map