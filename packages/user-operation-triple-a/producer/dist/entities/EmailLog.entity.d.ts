import { Customer } from './Customer.entity';
export declare class EmailLog {
    id: number;
    is_obsolete: boolean;
    modified_on: Date | null;
    idx: string;
    email: string | null;
    token: string | null;
    user: Customer;
    created_on: Date;
    is_active: boolean;
}
