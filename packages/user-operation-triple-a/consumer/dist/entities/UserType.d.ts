import { PermissionUserType } from './PermissionUserType';
import { Users } from './Users';
import { UsersTemp } from './UsersTemp';
export declare class UserType {
    id: number;
    idx: string;
    user_type: string | null;
    description: string | null;
    permissionsUserType: PermissionUserType[];
    users: Users[];
    usersTemps: UsersTemp[];
    is_active: boolean;
    is_obsolete: boolean;
    modified_on: Date | null;
    created_on: Date;
    constructor(user_type?: string, description?: string);
}
