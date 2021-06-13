import { IsOptional } from '@common/customs/customOptional';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsIn,
	IsNumberString,
	IsString,
	Length,
	ValidateIf,
} from 'class-validator';

/**
 *
 *
 * @export
 * @class UpdateUser
 */
export class UpdateUser {
	idx?: string;
	@ApiProperty({
		description: 'Contact name of company',
		example: 'John Von Neuman',
	})
	@IsOptional()
	@IsString()
	@Length(4, 100, {
		message: 'Contact name must be between 4 to 100 characters long',
	})
	contact_name?: string;

	@ApiProperty({
		description: 'Email of user',
		example: 'abc@xyz.com',
	})
	@IsOptional()
	@IsEmail({}, { message: 'Email is invalid' })
	@Length(10, 64, {
		message: 'Email must be between 10 to 64 characters long',
	})
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	email?: string;

	@ApiPropertyOptional({
		description: 'Name of provider',
		example: 'abc corp',
	})
	@IsOptional()
	@ValidateIf((o, _) => o.employer_no !== '')
	@IsString({ message: 'Payroll system must be a string' })
	@IsIn(['PAYCHEX', 'STANDALONE'])
	payroll_system: string;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Time Management system'
	})
	@ValidateIf((o, _) => o.employer_no !== '')
	@IsString({ message: 'Time management system must be a string' })
	time_management_system: string;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Company internal hr system'
	})
	@ValidateIf((o, _) => o.employer_no !== '')
	@IsString({ message: 'Company internal HR must be a string' })
	company_internalhr_system: string;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Employer number'
	})
	@IsString()
	employer_no?: string;

	@ApiPropertyOptional({
		description: 'User type of user',
		example: 'fab74e6089390695fe29f591068abcbf10f5cc25',
	})
	@IsOptional()
	user_type?: any;

	@ApiPropertyOptional({
		description: 'Address of user',
		example: 'Abc Street',
	})
	@IsOptional()
	@IsString({ message: 'Address must be string' })
	@Length(5, 30, {
		message: 'Address must be between 5 to 30 characters long',
	})
	address?: string;

	@ApiPropertyOptional({
		description: 'Name of company',
		example: 'abc corp',
	})
	@IsOptional()
	@IsString({ message: 'Company name must be a string' })
	@Length(4, 100, {
		message: 'Company name must be between 4 to 100 characters long',
	})
	company_name?: string;

	@ApiPropertyOptional({
		description: 'Name of company',
		example: 'abc corp',
	})
	@IsOptional()
	@IsNumberString()
	zip_code?: string;

	@ApiProperty({
		description: 'Ext of phone number',
		example: '+977',
	})
	@IsOptional()
	phone_ext?: string;

	// @IsOptional()
	// @IsOptional()
	// @IsBoolean()
	// receive_signed_agreement: boolean;

	// @IsOptional()
	// @IsBoolean()
	// receive_questionare_form: boolean;
    @IsOptional()
	@ApiPropertyOptional({
			description: 'Phone number'
		})
	phone_number?: string;
}
