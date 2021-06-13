import { IsOptional } from '@common/customs/customOptional';
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMinSize,
	IsNotEmpty,
	IsString,
	IsUUID,
	Length,
} from 'class-validator';

/**
 *
 *
 * @export
 * @class UpdateUserTypePermissions
 */
export class UpdateUserTypePermissions {
	@ApiProperty({
		description: 'Permissions of the user type',
		example: '["gafsfa","asasasas","ahskjahs"]',
	})
	@IsNotEmpty({ message: 'Permission are missing' })
	@ArrayMinSize(1, { message: 'Role requires atleast one permission' })
	@IsUUID('all', { each: true, message: 'Permissions must be a uuid array' })
	permission: Array<string>;

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
