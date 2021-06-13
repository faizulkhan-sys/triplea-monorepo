import { Customer } from '@entities/Customer.entity';
import { Users } from '@entities/Users';
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
		@InjectRepository(Users)
		private readonly employerRepo: Repository<Users>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwt.secret,
			ignoreExpiration: false,
		});
	}	

	async validate(payload: { idx: string }): Promise<any> {
		const { idx } = payload;
		const user = await this.usersRepo.findOne({
			where: { idx, is_active: true, is_obsolete: false },
		});
		console.log("idx retrieved");
		console.log(idx)
		if (!user) {
			const employer = await this.employerRepo.findOne({
				where: { idx, is_active: true, is_obsolete: false },
			});
			console.log("not a user checking for employer");
			
			if (!employer) {
				throw new UnprocessableEntityException('User not found');
			} else {
				console.log("Its an employer");
				console.log(employer)
				return employer;
			}
		}
		console.log("Its a user");
		console.log(user);
		return user;
	}
}
