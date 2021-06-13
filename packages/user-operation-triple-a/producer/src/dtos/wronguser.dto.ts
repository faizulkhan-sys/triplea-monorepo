import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsUUID,
	Length,
} from 'class-validator';

/**
 *
 *
 * @export
 * @class WrongUserFound
 */

export class WrongUserFound {
	@ApiProperty({
		description: 'Email of employee',
		// example: 'test@gmail.com',
	})
	@IsNotEmpty()
	@Length(10, 64)
	@IsEmail({})
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	employee_email: string;

	@ApiProperty({
		description: 'SSN No',
		// example: '4121',
	})
	@IsNotEmpty()
	@IsNumberString({ no_symbols: true })
	@Length(4, 4, {
		message: 'SSN no must be exactly 4 digit in length',
	})
	ssn_no: string;

	@ApiProperty({
		description: 'employee_id'
	})
	@IsNotEmpty()
	@Length(1, 5)
	employee_id: string;

	@ApiProperty({
		description: 'zip_code',
		// example: '1234',
	})
	@IsNotEmpty()
	@IsNumberString({ no_symbols: true })
	@Length(5, 5, {
		message: 'Zip code must be exactly 5 digit in length',
	})
	zip_code: string;

	@ApiProperty({
		description: 'employer_id'
	})
	@IsNotEmpty()
	@IsUUID('all')
	employer_id: string;
}
