import { PermissionUserType } from './PermissionUserType';
import { PermissionUserTypeTemp } from './PermissionUserTypeTemp';
export declare class Permission {
    id: number;
    idx: string;
    base_name: string;
    url: string;
    method: string;
    created_on: Date;
    is_active: boolean;
    permission_type: string | null;
    alias: string;
    permissionUserType: PermissionUserType[];
    permissionRoleTemps: PermissionUserTypeTemp[];
    is_obsolete: boolean;
    modified_on: Date | null;
}
