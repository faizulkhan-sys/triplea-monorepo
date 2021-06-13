import { ApproveRejectDto } from './ApproveReject.dto';

export class ServiceBusBodyDto {
  approveRejectDto: ApproveRejectDto;
  operation: string;
  data: any;
}
