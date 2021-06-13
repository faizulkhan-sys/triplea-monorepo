import { UserOperationModule } from '@modules/user-operation/user-operation.module';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ServiceBusReceiverService } from './service-bus-receiver.service';

@Module({
  imports: [UserOperationModule],
  providers: [ServiceBusReceiverService],
})
export class ServiceBusReceiverModule implements OnModuleInit {
  constructor(private serviceBusReceiverService: ServiceBusReceiverService) {}

  onModuleInit() {
    Logger.log('Service Bus Receiver On Init Module');
    Logger.log('Initialization...');
    try {
      this.serviceBusReceiverService.receiveMessageAsync();
    } catch (err) {
      Logger.error(err);
    }
  }
}
