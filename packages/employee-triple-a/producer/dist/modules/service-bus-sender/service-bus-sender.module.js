"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBusSenderModule = void 0;
const common_1 = require("@nestjs/common");
const service_bus_sender_service_1 = require("./service-bus-sender.service");
let ServiceBusSenderModule = class ServiceBusSenderModule {
};
ServiceBusSenderModule = __decorate([
    common_1.Module({
        controllers: [],
        providers: [service_bus_sender_service_1.ServiceBusSenderService],
        exports: [service_bus_sender_service_1.ServiceBusSenderService],
    })
], ServiceBusSenderModule);
exports.ServiceBusSenderModule = ServiceBusSenderModule;
//# sourceMappingURL=service-bus-sender.module.js.map