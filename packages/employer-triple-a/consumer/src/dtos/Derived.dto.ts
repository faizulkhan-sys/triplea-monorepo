import { EndsWith } from '@common/customs/Endswith';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { BaseDto } from './Base.dto';
import { EmployerLoginDto } from './employerLogin.dto';

/**
 *
 *
 * @export
 * @class ResetPasswordDto
 * @extends {PickType(BaseDto, [
 * 	'password',
 * ] as const)}
 */
export class ResetPasswordDto extends PickType(BaseDto, [
	'password',
] as const) {}

/**
 *
 *
 * @export
 * @class IdxArray
 * @extends {PickType(BaseDto, ['idx'] as const)}
 */

export class IdxArray extends PickType(BaseDto, ['idx'] as const) {}

/**
 *
 *
 * @export
 * @class InviteUserMobile
 * @extends {PickType(BaseDto, [
 * 	'employee_email',
 * 	'employer_email',
 * ] as const)}
 */
export class InviteUserMobile extends PickType(BaseDto, [
	'employee_email',
	'employer_email',
] as const) {}

/**
 *
 *
 * @export
 * @class ContactMe
 * @extends {PickType(BaseDto, ['employer_email'] as const)}
 */
export class ContactMe extends PickType(BaseDto, ['employer_email'] as const) {}

/**
 *
 *
 * @export
 * @class ForgotPassword
 * @extends {PickType(BaseDto, [
 * 	'employer_email',
 * ] as const)}
 */
export class ForgotPassword extends PickType(BaseDto, [
	'employer_email',
] as const) {}

/**
 *
 *
 * @export
 * @class ResetPassword
 * @extends {PickType(BaseDto, [
 * 	'password',
 * 	'otp_code',
 * ] as const)}
 */
export class ResetPassword extends PickType(BaseDto, [
	'password',
	'otp_code',
] as const) {}

/**
 *
 *
 * @export
 * @class UserLoginDto
 * @extends {PickType(EmployerLoginDto, [
 * 	'captcha_token',
 * 	'captcha',
 * 	'password'
 * ] as const)}
 */
export class UserLoginDto extends PickType(EmployerLoginDto, [
	'captcha_token',
	'captcha',
	'password',
] as const) {
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be valid' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	@EndsWith({ message: 'Email must end with orbispay.me' })
	public email?: string;
}
