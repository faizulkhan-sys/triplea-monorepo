import { Customer } from '@entities/Customer.entity';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '@config/index';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(Customer)
		private readonly usersRepo: Repository<Customer>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwt.secret,
			ignoreExpiration: false,
		});
	}

	async validate(payload: { idx: string }): Promise<Customer> {
		const { idx } = payload;
		const user = await this.usersRepo.findOne({
			where: { idx, is_active: true, is_obsolete: false },
		});

		if (!user) {
			throw new UnprocessableEntityException('User not found');
		}

		return user;
	}
}
