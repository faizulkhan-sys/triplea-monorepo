import { Permission } from './Permission';
import { UserType } from './UserType';
export declare class PermissionUserType {
    id: number;
    idx: string;
    userType: UserType | null;
    permission: Permission | null;
    created_on: Date;
    is_active: boolean;
    base_name: string | null;
    is_obsolete: boolean;
    modified_on: Date | null;
}
