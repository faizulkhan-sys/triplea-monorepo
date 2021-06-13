import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokens } from '@entities/RefreshToken.entity';
import { Customer } from '@entities/Customer.entity';
import { Users } from '@entities/Users';
import config from '@config/index';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([RefreshTokens, Customer,Users]),
		JwtModule.register({
			secret: config.jwt.secret,
			signOptions: {
				expiresIn: config.jwt.access_expiry,
			},
		}),
	],
	controllers: [],
	providers: [TokensService, RefreshTokensRepository, JwtStrategy],
	exports: [TokensService],
})
export class TokenModule {}
