import { Customer } from '@entities/Customer.entity';
export declare function checkForFailedMpin(customer: Customer, device: string, ip: string, login_type: string, activity_type: string): Promise<void>;
