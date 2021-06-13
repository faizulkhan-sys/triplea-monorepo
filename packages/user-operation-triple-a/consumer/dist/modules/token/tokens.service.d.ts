import { Customer } from '@entities/Customer.entity';
import { RefreshTokens } from '@entities/RefreshToken.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { Iresponse } from '@common/interfaces/response.interface';
export interface RefreshTokenPayload {
    jti: number;
    sub: number;
}
export declare class TokensService {
    private readonly customerRepository;
    private readonly tokens;
    private readonly jwt;
    constructor(tokens: RefreshTokensRepository, jwt: JwtService, customerRepository: Repository<Customer>);
    generateAccessToken(user: Customer): Promise<string>;
    generateRefreshToken(user: Customer, expiresIn: number): Promise<string>;
    resolveRefreshToken(encoded: string): Promise<{
        user: Customer;
        token: RefreshTokens;
    }>;
    createAccessTokenFromRefreshToken(refresh: string): Promise<{
        token: string;
        user: Customer;
    }>;
    decodeRefreshToken(token: string): Promise<RefreshTokenPayload>;
    private getUserFromRefreshTokenPayload;
    private getStoredTokenFromRefreshTokenPayload;
    deleteRefreshTokenForUser(user: Customer): Promise<Iresponse>;
    deleteRefreshToken(user: Customer, payload: RefreshTokenPayload): Promise<Iresponse>;
    pickCustomerFields(user: Customer): Pick<Customer, "id" | "idx" | "employee_id" | "employer_id">;
}
