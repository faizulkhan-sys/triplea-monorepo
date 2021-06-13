import { Injectable } from '@nestjs/common';

import { RefreshTokens } from '@entities/RefreshToken.entity';
import { Customer } from '@entities/Customer.entity';

@Injectable()
export class RefreshTokensRepository {
	public async createRefreshToken(
		user: Customer,
		ttl: number,
	): Promise<RefreshTokens> {
		const token = new RefreshTokens();

		token.user = user;
		token.is_revoked = false;

		const expiration = new Date();

		expiration.setTime(expiration.getTime() + ttl * 1000);

		token.expires_in = expiration;

		return token.save();
	}

	public async findTokenById(id: number): Promise<RefreshTokens | null> {
		return RefreshTokens.findOne({
			where: {
				id,
				is_revoked: false,
			},
		});
	}

	public async deleteTokensForUser(employee: Customer): Promise<any> {
		return RefreshTokens.update({ user: employee }, { is_revoked: true });
	}

	public async deleteToken(
		employee: Customer,
		tokenId: number,
	): Promise<any> {
		return RefreshTokens.update(
			{ user: employee, id: tokenId },
			{ is_revoked: true },
		);
	}
}
