import { RefreshTokens } from '@entities/RefreshToken.entity';
import { Customer } from '@entities/Customer.entity';
export declare class RefreshTokensRepository {
    createRefreshToken(user: Customer, ttl: number): Promise<RefreshTokens>;
    findTokenById(id: number): Promise<RefreshTokens | null>;
    deleteTokensForUser(employee: Customer): Promise<any>;
    deleteToken(employee: Customer, tokenId: number): Promise<any>;
}
