import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	ArrayMinSize,
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsUUID,
	Length,
	Matches,
} from 'class-validator';

/**
 *
 *
 * @export
 * @class BaseDto
 */

export class BaseDto {
	@IsNotEmpty()
	@IsUUID('all', { each: true })
	@ArrayMinSize(1, { message: 'Idx array requires at least one idx' })
	idx: Array<string>;

	@ApiProperty({
		description: 'Emailof employer',
		example: 'test@gmail.com',
	})
	@IsNotEmpty({ message: 'Email must not be empty' })
	@Length(8, 64, {
		message: 'Employer Email must be between 8 to 64 characters long',
	})
	@IsEmail({}, { message: 'Employer Email must be a valid email' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	employer_email: string;

	@ApiProperty({
		description: 'Emailof employee',
		example: 'test@gmail.com',
	})
	@IsNotEmpty({ message: 'Email must not be empty' })
	@Length(8, 64, {
		message: 'Employee Email must be between 8 to 64 characters long',
	})
	@IsEmail({}, { message: 'Employee Email must be a valid email' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	employee_email: string;

	@IsNotEmpty({ message: 'Otp code must not be empty' })
	@Length(6, 6, { message: 'Otp code must be 6 digits' })
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Otp code must be numeric string' },
	)
	otp_code: string;

	@ApiProperty({
		description: ' Password to set',
		example: 'test@1234',
	})
	@IsNotEmpty({ message: 'Password cannot be empty' })
	@Length(8, 64, {
		message: 'Password must be between 6 to 64 characters long',
	})
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Password must contain at least 1 special character,uppercase letter, lowercase letter and number each',
		},
	)
	password: string;
}
