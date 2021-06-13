import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	Equals,
	IsAlphanumeric,
	IsEmail,
	IsIn,
	IsNotEmpty,
} from 'class-validator';

/**
 *
 *
 * @export
 * @class UserLoginDto
 */
export class EmployerLoginDto {
	@ApiProperty({
		description: 'Email',
		example: 'orbis@gmail.com',
	})
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be valid' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	public email?: string;

	@ApiProperty({
		description: 'Password',
		example: 'test@1234',
	})
	@ApiProperty()
	@IsNotEmpty()
	public password?: string;

	@ApiProperty({
		description: 'Captcha',
		example: 'tR3eYM',
	})
	@IsNotEmpty()
	@IsAlphanumeric('en-US', { message: 'Captcha can only be alphanumeric' })
	public captcha?: string;

	@ApiProperty({
		description: 'Captcha token',
		example: 'test@1234',
	})
	@IsNotEmpty()
	public captcha_token?: string;
}
