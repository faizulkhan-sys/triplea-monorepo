import { BaseEntity } from 'typeorm';
import { Customer } from './Customer.entity';
export declare class EmployeeCardInfoEntity extends BaseEntity {
    id: number;
    idx: string;
    created_on: Date;
    modified_on: Date | null;
    customer: Customer;
    card_number: string | null;
    expiry_date: Date | null;
    cvv: string | null;
    pin: string | null;
    type: string;
    tabapay_account_id: string;
}
