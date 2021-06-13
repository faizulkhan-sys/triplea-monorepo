import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length, Matches } from 'class-validator';
import { CreateFilterDto } from './AddFilter';
import { BaseDto } from './Base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CheckEmail extends PickType(BaseDto, ['email'] as const) {}

export class AddOrChangeNumber extends PickType(BaseDto, [
	'mobile_number',
] as const) {}

export class ForgotPassword extends PickType(BaseDto, ['email'] as const) {}
export class SetMpin extends PickType(BaseDto, ['mpin'] as const) {}

export class ChangeMpin extends PickType(BaseDto, ['mpin'] as const) {
	@IsNotEmpty({ message: 'Mpin must not be empty' })
	@Length(4, 4, { message: 'Mpin must be 4 digits' })
	@ApiProperty({
		description: 'New Mpin',
	})
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Mpin must be numeric string' },
	)
	new_mpin: string;
}

export class IdEmployeeDto extends PickType(BaseDto, [
	'employee_id',
	'employer_id',
	'ssn_no',
] as const) {}

export class OtpDto extends PickType(BaseDto, ['otp_code'] as const) {}

export class ResetPassword extends PickType(BaseDto, [
	'password',
	'otp_code',
] as const) {}

export class ResetMpin extends PickType(BaseDto, [
	'mpin',
	'otp_code',
] as const) {}

export class SignUpEmployee extends PickType(BaseDto, [
	'email',
	'password',
	'idx',
] as const) {}

export class InviteEmployees extends PickType(BaseDto, ['idx'] as const) {}

export class ExecuteFilter extends PickType(CreateFilterDto, [
	'criteria',
	'value',
] as const) {}

export class ChangePassword extends PickType(BaseDto, ['password'] as const) {
	@IsNotEmpty({ message: 'New password cannot be empty' })
	@ApiProperty({
		description: 'New Password',
	})
	@Length(8, 64, {
		message: 'New password must be between 8 to 64 characters long',
	})
	new_password: string;
}

export class RefreshRequest {
	@ApiProperty({
		description: 'Refresh Token',
	})
	@IsNotEmpty({ message: 'The refresh token is required' })
	refresh_token: string;
}
