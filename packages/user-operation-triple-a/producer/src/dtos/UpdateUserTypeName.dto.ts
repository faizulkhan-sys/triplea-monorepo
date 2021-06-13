import { IsOptional } from '@common/customs/customOptional';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

/**
 *
 *
 * @export
 * @class UpdateUserTypeName
 */
export class UpdateUserTypeName {
	@ApiProperty({
		description: 'Name of the user type',
		example: 'Business User',
	})
	@IsNotEmpty({ message: 'User type name is required' })
	@Matches(/^[-_ a-zA-Z0-9]+$/, { message: 'Role name must be alphanumeric' })
	@Length(3, 50, {
		message: 'user type name must be between 3 and 50 characters long',
	})
	user_type: string;

	@ApiProperty({
		description: 'Description of the user type',
		example: 'Business User',
	})
	@IsOptional()
	@Length(3, 90, {
		message: 'Description must be between 3 and 90 characters long',
	})
	@IsString()
	description?: string;
}
