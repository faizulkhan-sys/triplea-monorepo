import { Customer } from './Customer.entity';
export declare class ActivityLog {
    id: number;
    idx: string | null;
    user: Customer;
    activity_type: string | null;
    login_type: string | null;
    ip_address: string | null;
    device_id: string | null;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    status: boolean;
    login_status: boolean;
    modified_on: Date | null;
}
