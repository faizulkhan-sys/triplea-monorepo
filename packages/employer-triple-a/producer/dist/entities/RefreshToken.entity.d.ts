import { BaseEntity } from 'typeorm';
import { Users } from '@entities/Users';
export declare class RefreshTokens extends BaseEntity {
    id: number;
    idx: string | null;
    user: Users;
    expires_in: Date;
    is_revoked: boolean;
    created_on: Date;
    modified_on: Date | null;
}
