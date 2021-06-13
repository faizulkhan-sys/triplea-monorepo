import { BaseEntity } from 'typeorm';
import { Customer } from './Customer.entity';
export declare class EmployeePlaidInfo extends BaseEntity {
    id: number;
    idx: string;
    created_on: Date;
    modified_on: Date | null;
    is_active: boolean;
    is_obsolete: boolean;
    customer: Customer;
    bank_name: string;
    access_token: string;
    item_id: string;
    account: string;
    account_id: string;
    routing: string;
    wire_routing: string;
}
