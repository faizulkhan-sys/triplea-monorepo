import { Users } from './Users';
export declare class ActivityLog {
    id: number;
    idx: string | null;
    user_id: Users;
    activity_type: string | null;
    login_status: boolean | null;
    login_type: string | null;
    ip_address: string | null;
    device_id: string | null;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
}
