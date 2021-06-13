export declare class Users {
    idx: string | null;
    username: string;
    contact_name: string;
    password: string;
    email: string | null;
    address: string | null;
    phone_number: string | null;
    company_id: string;
    display_id: string;
    legal_name: string;
    employer_no: string | null;
    phone_ext: string | null;
    company_name: string | null;
    fb_id: string | null;
    google_id: string | null;
    zip_code: string | null;
    created_on: Date;
    is_active: boolean;
    is_superadmin: boolean;
    id: number;
    is_obsolete: boolean;
    modified_on: Date | null;
    constructor(contact_name?: string, email?: string, zip_code?: string, company_name?: string, is_superadmin?: boolean);
}
