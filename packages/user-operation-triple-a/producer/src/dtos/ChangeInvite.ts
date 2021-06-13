import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

/**
 *
 *
 * @export
 * @class ChangeInviteStatusDto
 */
export class ChangeInviteStatusDto {
	@ApiProperty({
		description: 'status. can be either INVITED,CONTACTED or ONBOARDED',
		example: 'INVITED',
	})
	@IsIn(['INVITED', 'CONTACTED', 'ONBOARDED'], {
		message: 'status can be either INVITED,CONTACTED or ONBOARDED',
	})
	status: string;
}
