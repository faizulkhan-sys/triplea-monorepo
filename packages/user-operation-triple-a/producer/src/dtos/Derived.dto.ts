import { EndsWith } from '@common/customs/Endswith';
import { PickType, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CheckEmail extends PickType(BaseDto, ['email'] as const) {}

export class AddOrChangeNumber extends PickType(BaseDto, [
	'mobile_number',
] as const) {}

export class IdEmployeeDto extends PickType(BaseDto, [
	'employee_id',
	'employer_id',
	'ssn_no',
] as const) {}
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
	@ApiPropertyOptional({
		description: 'Email'
	})
	@IsEmail({}, { message: 'Email must be valid' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	@EndsWith({ message: 'Email must end with orbispay.me' })
	public email?: string;
}
