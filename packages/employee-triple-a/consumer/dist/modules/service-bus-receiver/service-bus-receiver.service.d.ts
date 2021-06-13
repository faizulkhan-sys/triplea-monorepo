import { EmployeeAuthService } from '@modules/employee-auth/employee-auth.service';
export declare class ServiceBusReceiverService {
    private readonly empAuthService;
    constructor(empAuthService: EmployeeAuthService);
    receiveMessageAsync(): Promise<void>;
}
