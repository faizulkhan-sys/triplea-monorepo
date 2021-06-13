import { Users } from './Users';
export declare class OtpLog {
    id: number;
    idx: string;
    otp_code: string | null;
    user: Users;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
}
