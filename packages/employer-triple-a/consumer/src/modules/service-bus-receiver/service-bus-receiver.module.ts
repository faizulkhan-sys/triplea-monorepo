import { EmployerAuthModule } from '@modules/employer-auth/employer-auth.module';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ServiceBusReceiverService } from './service-bus-receiver.service';

@Module({
  imports: [EmployerAuthModule],
  providers: [ServiceBusReceiverService],
})
export class ServiceBusReceiverModule implements OnModuleInit {
  constructor(private serviceBusReceiverService: ServiceBusReceiverService) {}

  onModuleInit() {
    const logger = new Logger('Service Bus Receiver On Init Module for Queue');

    logger.log('Service Bus Receiver On Init Module');
    logger.log('Initialization...');
    try {
      this.serviceBusReceiverService.receiveMessageAsync();
    } catch (err) {
      logger.error(err);
    }
  }
}
