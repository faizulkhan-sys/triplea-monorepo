import { PermissionUserTypeTemp } from './PermissionUserTypeTemp';
import { UserType } from './UserType';
export declare class UserTypeTemp {
    id: number;
    idx: string;
    description: string | null;
    created_on: Date;
    is_active: boolean;
    userType: UserType | null;
    user_type: string | null;
    created_by: string;
    status: string | null;
    alias: string | null;
    operation: string | null;
    rejection_reason: string | null;
    permissionUserTypeTemps: PermissionUserTypeTemp[];
    is_obsolete: boolean;
    modified_on: Date | null;
}
