import { RefreshTokens } from '@entities/RefreshToken.entity';
import { Users } from '@entities/Users';
export declare class RefreshTokensRepository {
    createRefreshToken(user: Users, ttl: number): Promise<RefreshTokens>;
    findTokenById(id: number): Promise<RefreshTokens | null>;
    deleteTokensForUser(employer: Users): Promise<any>;
    deleteToken(employee: Users, tokenId: number): Promise<any>;
}
