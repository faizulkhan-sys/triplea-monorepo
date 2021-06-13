import { OnModuleInit } from '@nestjs/common';
import { ServiceBusReceiverService } from './service-bus-receiver.service';
export declare class ServiceBusReceiverModule implements OnModuleInit {
    private serviceBusReceiverService;
    constructor(serviceBusReceiverService: ServiceBusReceiverService);
    onModuleInit(): void;
}
