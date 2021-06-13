import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMinSize,
	IsNotEmpty,
	IsString,
	IsUUID,
	Length,
	Matches,
} from 'class-validator';

/**
 *
 *
 * @export
 * @class CreateUserType
 */

export class CreateUserType {
	@ApiProperty({
		description: 'Name of User type',
		example: 'fab74e6089390695fe29f591068abcbf10f5cc25',
	})
	@IsNotEmpty({ message: 'User type name is required' })
	@Length(3, 90, {
		message: 'User type name must be between 3 and 90 characters long',
	})
	@Matches(/^[-_ a-zA-Z0-9]+$/, {
		message: 'User type name must be alphanumeric',
	})
	user_type: string;

	@ApiProperty({
		description: 'Permission array',
		example: [
			'fab74e6089390695fe29f591068abcbf10f5cc25',
			'hab74e6089390695fe29f591068abcbf10f5cc25',
		],
	})
	@IsNotEmpty({ message: 'Permission are missing' })
	@IsUUID('all', { each: true, message: 'Permissions must be a uuid array' })
	@ArrayMinSize(1, { message: 'User type requires at least one permission' })
	permission: Array<string>;

	@ApiProperty({
		description: 'Description of User type',
		example: 'This is a description',
	})
	@IsNotEmpty({ message: 'Description is required' })
	@Length(3, 90, {
		message: 'Description must be between 3 and 90 characters long',
	})
	@IsString()
	description: string;

	@ApiProperty({
		description: 'Created by'
	})
	created_by?: string;
	
	@ApiProperty({
		description: 'Operation'
	})
	operation?: string;

	@ApiProperty({
		description: 'Status'
	})
	status?: string;
}
