export declare class EmployerSettings {
    id: number;
    idx: string;
    auto_approve: boolean;
    auto_invite: boolean;
    created_by: string;
    created_on: Date;
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
    constructor(auto_approve: boolean, auto_invite: boolean);
}
