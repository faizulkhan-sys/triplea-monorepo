import { EmployerAuthService } from '@modules/employer-auth/employer-auth.service';
export declare class ServiceBusReceiverService {
    private readonly empAuthService;
    constructor(empAuthService: EmployerAuthService);
    receiveMessageAsync(): Promise<void>;
}
