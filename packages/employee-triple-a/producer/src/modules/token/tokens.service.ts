import { Customer } from '@entities/Customer.entity';
import { RefreshTokens } from '@entities/RefreshToken.entity';
import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import config from '@config/index';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { IResponse } from '@common/interfaces/response.interface';
import { pick } from '@rubiin/js-utils';

const BASE_OPTIONS: SignOptions = {
	issuer: 'orbis',
	audience: 'orbis',
};

export interface RefreshTokenPayload {
	jti: number;
	sub: number;
}

@Injectable()
export class TokensService {
	private readonly tokens: RefreshTokensRepository;
	private readonly jwt: JwtService;

	public constructor(
		tokens: RefreshTokensRepository,
		jwt: JwtService,
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
	) {
		this.tokens = tokens;
		this.jwt = jwt;
	}

	public async generateAccessToken(user: Customer): Promise<string> {
		const opts: SignOptions = {
			...BASE_OPTIONS,
			expiresIn: config.jwt.expiresIn,
			subject: String(user.id),
		};

		return this.jwt.signAsync({ ...this.pickCustomerFields(user) }, opts);
	}

	public async generateRefreshToken(
		user: Customer,
		expiresIn: number,
	): Promise<string> {
		const token = await this.tokens.createRefreshToken(user, expiresIn);

		const opts: SignOptions = {
			...BASE_OPTIONS,
			expiresIn: config.jwt.refresh_expiry,
			subject: String(user.id),
			jwtid: String(token.id),
		};

		return this.jwt.signAsync({}, opts);
	}

	public async resolveRefreshToken(
		encoded: string,
	): Promise<{ user: Customer; token: RefreshTokens }> {
		const payload = await this.decodeRefreshToken(encoded);
		const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

		if (!token) {
			throw new UnprocessableEntityException('Refresh token not found');
		}

		if (token.is_revoked) {
			throw new UnprocessableEntityException('Refresh token revoked');
		}

		const user = await this.getUserFromRefreshTokenPayload(payload);

		if (!user) {
			throw new UnprocessableEntityException('Refresh token malformed');
		}

		return { user, token };
	}

	public async createAccessTokenFromRefreshToken(
		refresh: string,
	): Promise<{ token: string; user: Customer }> {
		const { user } = await this.resolveRefreshToken(refresh);

		const token = await this.generateAccessToken(user);

		return { user, token };
	}

	async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
		try {
			return this.jwt.verifyAsync(token);
		} catch (e) {
			if (e instanceof TokenExpiredError) {
				throw new UnprocessableEntityException('Refresh token expired');
			} else {
				throw new UnprocessableEntityException(
					'Refresh token malformed',
				);
			}
		}
	}

	private async getUserFromRefreshTokenPayload(
		payload: RefreshTokenPayload,
	): Promise<Customer> {
		const subId = payload.sub;

		if (!subId) {
			throw new UnprocessableEntityException('Refresh token malformed');
		}

		return this.customerRepository.findOne({
			where: {
				id: subId,
			},
		});
	}

	private async getStoredTokenFromRefreshTokenPayload(
		payload: RefreshTokenPayload,
	): Promise<RefreshTokens | null> {
		const tokenId = payload.jti;

		if (!tokenId) {
			throw new UnprocessableEntityException('Refresh token malformed');
		}

		return this.tokens.findTokenById(tokenId);
	}

	/**
	 *
	 * Remove all the refresh tokens associated to a user
	 *
	 * @param {Customer} user
	 * @memberof TokensService
	 */
	async deleteRefreshTokenForUser(user: Customer): Promise<IResponse> {
		await this.tokens.deleteTokensForUser(user);

		return { message: 'Operation Sucessful', statusCode: 200 };
	}

	/**
	 *
	 * Removes a refresh token, and invalidated all access tokens for the user
	 *
	 * @param {Customer} user
	 * @param {RefreshTokenPayload} payload
	 * @memberof TokensService
	 */
	async deleteRefreshToken(
		user: Customer,
		payload: RefreshTokenPayload,
	): Promise<IResponse> {
		const tokenId = payload.jti;

		if (!tokenId) {
			throw new UnprocessableEntityException('Refresh token malformed');
		}
		await this.tokens.deleteToken(user, tokenId);

		return { message: 'Operation Sucessful', statusCode: 200 };
	}

	public pickCustomerFields(user: Customer) {
		return pick(user, ['id', 'idx', 'employer_id', 'employee_id']);
	}
}
