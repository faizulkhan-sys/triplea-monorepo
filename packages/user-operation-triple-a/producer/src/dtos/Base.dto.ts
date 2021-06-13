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
	IsAlphanumeric
} from 'class-validator';

/**
 *
 *
 * @export
 * @class BaseDto
 */

export class BaseDto {
	@IsNotEmpty()
	@ApiProperty({
		description: "Idx"
	})
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
	@ApiProperty({
		description: "Otp Code"
	})
	@Length(6, 6, { message: 'Otp code must be 6 digits' })
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Otp code must be numeric string' },
	)
	otp_code: string;
	
	@ApiProperty({
		name: 'Employer id',
		description: 'Example aesy35has7',
	})
	@IsNotEmpty({ message: 'Employer id must not be empty' })
	@IsUUID('all', { message: 'Employer id must  be an uuid' })
	employer_id: string;

	@ApiProperty({
		name: 'Last 4 digits of ssn no',
		description: 'Example 7866',
	})
	@IsNotEmpty({ message: 'SSN no must not be empty' })
	@Length(4, 4, { message: 'SSN no must be 4 digits' })
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'SSN no must be numeric string' },
	)
	ssn_no: string;

	@ApiProperty({
		name: 'Employee id',
		description: 'Example 1000451',
	})
	@IsNotEmpty({ message: 'Employee id must not be empty' })
	@IsAlphanumeric('en-US', { message: 'Employee id must be alphanumeric' })
	@Length(1, 5, {
		message: 'Employee id must be between 1 and 5 digits long',
	})
	employee_id: string;

	@IsNotEmpty({ message: 'Email must not be empty' })
	@Length(8, 64, {
		message: 'Contact Email must be between 8 to 64 characters long',
	})
	@ApiProperty({
		description: "Email"
	})
	@IsEmail({}, { message: 'Contact Email must be a valid email' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	email: string;

	@IsNotEmpty({ message: 'Mobile Number  must not be empty' })
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Mobile code must be numeric string' },
	)
	@ApiProperty({
		description: "Mobile Number"
	})
	@Length(10, 10, { message: 'Mobile number must not be empty' })
	mobile_number: string;

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
