import { UserOperationService } from '@modules/user-operation/user-operation.service';
export declare class ServiceBusReceiverService {
    private readonly userOperationService;
    constructor(userOperationService: UserOperationService);
    receiveMessageAsync(): Promise<void>;
}
