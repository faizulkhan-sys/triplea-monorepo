import { Users } from '@entities/Users';
import { RefreshTokens } from '@entities/RefreshToken.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { IResponse } from '@common/interfaces/response.interface';
export interface RefreshTokenPayload {
    jti: number;
    sub: number;
}
export declare class TokensService {
    private readonly userRepository;
    private readonly tokens;
    private readonly jwt;
    constructor(tokens: RefreshTokensRepository, jwt: JwtService, userRepository: Repository<Users>);
    generateAccessToken(user: Users): Promise<string>;
    generateRefreshToken(user: Users, expiresIn: number): Promise<string>;
    resolveRefreshToken(encoded: string): Promise<{
        user: Users;
        token: RefreshTokens;
    }>;
    createAccessTokenFromRefreshToken(refresh: string): Promise<{
        token: string;
        user: Users;
    }>;
    decodeRefreshToken(token: string): Promise<RefreshTokenPayload>;
    private getUserFromRefreshTokenPayload;
    private getStoredTokenFromRefreshTokenPayload;
    deleteRefreshTokenForUser(user: Users): Promise<IResponse>;
    deleteRefreshToken(user: Users, payload: RefreshTokenPayload): Promise<IResponse>;
    pickCustomerFields(user: Users): Pick<Users, "idx" | "email">;
}
