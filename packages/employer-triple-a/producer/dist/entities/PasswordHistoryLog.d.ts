import { Users } from '@entities/Users';
export declare class PasswordHistoryLog {
    id: number;
    idx: string | null;
    user_id: Users;
    password: string | null;
    created_on: Date;
    modified_on: Date | null;
    is_active: boolean;
    is_obsolete: boolean;
}
