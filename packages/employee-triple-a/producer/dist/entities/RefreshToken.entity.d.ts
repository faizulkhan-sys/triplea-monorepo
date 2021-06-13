import { BaseEntity } from 'typeorm';
import { Customer } from './Customer.entity';
export declare class RefreshTokens extends BaseEntity {
    id: number;
    idx: string | null;
    user: Customer;
    expires_in: Date;
    is_revoked: boolean;
    created_on: Date;
    modified_on: Date | null;
}
