import { Users } from './Users';
export declare class EmailLog {
    id: number;
    is_obsolete: boolean;
    modified_on: Date | null;
    idx: string;
    email: string | null;
    token: string | null;
    user: Users | null;
    created_on: Date;
    is_active: boolean;
}
