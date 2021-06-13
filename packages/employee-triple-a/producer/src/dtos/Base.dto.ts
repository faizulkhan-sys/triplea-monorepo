import { ApiProperty } from '@nestjs/swagger';
import {
	IsAlphanumeric,
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsUUID,
	Length,
	Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseDto {
	@ApiProperty({
		description: 'Zip Code',
	})
	@IsNotEmpty({ message: 'Zip code must not be empty' })
	@Length(5, 5, {
		message: 'Zip code must be between 5 digits long',
	})
	zip_code: string;

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

	@ApiProperty({
		description: 'Example test@gmail.com',
	})
	@IsNotEmpty({ message: 'Email must not be empty' })
	@Length(8, 64, {
		message: 'Contact Email must be between 8 to 64 characters long',
	})
	@IsEmail({}, { message: 'Contact Email must be a valid email' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	email: string;

	@ApiProperty({
		description: ' Password to set',
		example: 'test@1234',
	})
	@IsNotEmpty({ message: 'Password cannot be empty' })
	@Length(8, 64, {
		message: 'Password must be between 8 to 64 characters long',
	})
	// @Matches(
	// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
	// 	{
	// 		message:
	// 			'Password must contain at least 1 special character,uppercase letter, lowercase letter and number each',
	// 	},
	// )
	password: string;

	@IsNotEmpty({ message: 'Mobile Number  must not be empty' })
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Mobile code must be numeric string' },
	)
	@ApiProperty({
		description: 'Mobile Number',
	})
	@Length(10, 10, { message: 'Mobile number must not be empty' })
	mobile_number: string;

	@IsNotEmpty({ message: 'Otp code must not be empty' })
	@Length(6, 6, { message: 'Otp code must be 6 digits' })
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Otp code must be numeric string' },
	)
	@ApiProperty({
		description: 'Otp Code',
	})
	otp_code: string;

	@IsNotEmpty({ message: 'idx must not be empty' })
	@IsUUID('all', { each: true, message: 'Idx must be an uuid array' })
	@ApiProperty({
		description: 'Idx',
	})
	idx: Array<string>;

	@IsNotEmpty({ message: 'Mpin must not be empty' })
	@Length(4, 4, { message: 'Mpin must be 4 digits' })
	@ApiProperty({
		description: 'Mpin',
	})
	@IsNumberString(
		{ no_symbols: true },
		{ message: 'Mpin must be numeric string' },
	)
	mpin: string;
}
