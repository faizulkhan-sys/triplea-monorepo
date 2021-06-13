import { Users } from './Users';
export declare class CompanyUser {
    id: number;
    is_obsolete: boolean;
    modified_on: Date | null;
    idx: string;
    company_idx: string | null;
    user: Users | null;
    created_on: Date;
    is_active: boolean;
}
