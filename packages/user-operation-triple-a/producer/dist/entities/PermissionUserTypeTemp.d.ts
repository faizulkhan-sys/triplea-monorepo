import { UserTypeTemp } from './UserTypeTemp';
import { Permission } from './Permission';
export declare class PermissionUserTypeTemp {
    id: number;
    idx: string;
    usertype: UserTypeTemp | null;
    permission: Permission | null;
    created_on: Date;
    is_active: boolean;
    base_name: string | null;
    is_obsolete: boolean;
    modified_on: Date | null;
}
