import { BaseEntity } from 'typeorm';
import { Customer } from './Customer.entity';
export declare class EmployeeDailyLogEntity extends BaseEntity {
    id: number;
    idx: string;
    created_on: Date;
    modified_on: Date | null;
    is_active: boolean;
    is_obsolete: boolean;
    customer: Customer;
    work_date: Date | null;
    hours_worked: string;
    earned_amount: string;
}
