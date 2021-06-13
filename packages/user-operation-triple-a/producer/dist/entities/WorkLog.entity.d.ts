import { Customer } from './Customer.entity';
export declare class WorkLog {
    id: number;
    idx: string | null;
    hours_worked: number | null;
    pay_rate: string;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    user: Customer;
    modified_on: Date | null;
}
