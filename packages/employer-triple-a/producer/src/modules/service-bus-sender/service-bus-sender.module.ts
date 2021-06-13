import { Module } from '@nestjs/common';
import { ServiceBusSenderService } from './service-bus-sender.service';

@Module({
  controllers: [],
  providers: [ServiceBusSenderService],
  exports: [ServiceBusSenderService],
})
export class ServiceBusSenderModule {}
