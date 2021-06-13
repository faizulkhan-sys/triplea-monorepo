import { Customer } from './Customer.entity';
export declare class OtpLog {
    id: number;
    idx: string;
    otp_code: string | null;
    user: Customer;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
}
