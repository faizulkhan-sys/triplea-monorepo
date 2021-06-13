import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

/**
 *
 *
 * @export
 * @class CreatePermission
 */
export class CreatePermission {
	idx: string;

	@ApiPropertyOptional({
		description: 'Base name of url',
		example: 'user',
	})
	@IsNotEmpty({ message: 'Base Name is required' })
	@IsString({ message: 'Base must be string' })
	@Length(3, 30, {
		message: 'Base name must be between 3 to 30 characters long',
	})
	base_name: string;

	@ApiPropertyOptional({
		description: 'Url',
		example: '/user',
	})
	@IsNotEmpty({ message: 'Url is required' })
	@IsString({ message: 'Url must be string' })
	@IsUrl({}, { message: 'Url must be string' })
	url: string;

	@ApiPropertyOptional({
		description: 'Method',
		example: 'POST',
	})
	@IsNotEmpty({ message: 'Method is required' })
	@IsString({ message: 'Method must be string' })
	@IsIn(['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], {
		message: 'Value must be a valid method',
	})
	method: string;

	@ApiProperty({
		description: "Created On"
	})
	created_on: string;

	@ApiProperty({
		description: "Modify On"
	})
	modified_on: string;

	@ApiProperty({
		description: "Is obsolete"
	})
	is_obsolete: boolean;
}
