import { Users } from './Users';
import { UserType } from './UserType';
export declare class UsersTemp {
    id: number;
    idx: string | null;
    user_type: UserType | null;
    username: string | null;
    contact_name: string;
    employee_email: string;
    password: string | null;
    time_management_system: string | null;
    company_internalhr_system: string | null;
    payroll_system: string | null;
    email: string | null;
    address: string | null;
    zip_code: string | null;
    phone_number: string | null;
    phone_ext: string | null;
    company_name: string | null;
    user: Users | null;
    is_superadmin: boolean;
    operation: string | null;
    created_by: string | null;
    status: string | null;
    receive_questionare_form: boolean;
    receive_signed_agreement: boolean;
    rejection_reason: string | null;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
    company_id: string;
    display_id: string;
    legal_name: string;
    employer_no: string | null;
    constructor(contact_name?: string, email?: string, zip_code?: string, company_name?: string, status?: string, user?: Users);
}
