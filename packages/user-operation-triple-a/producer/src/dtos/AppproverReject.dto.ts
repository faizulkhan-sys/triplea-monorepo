import { IsIn, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 *
 *
 * @export
 * @class ApproveRejectDto
 */
export class ApproveRejectDto {
	@ApiProperty({
		description: 'Status',
		example: 'ACCEPTED',
	})
	@IsIn(['APPROVED', 'REJECTED'], {
		message: 'Value must be either APPROVED or REJECTED',
	})
	status: string;

	@ApiPropertyOptional({
		description: 'Rejection reason',
		example: 'Rejected due to .... REquired only for rejected status',
	})
	@ValidateIf((o, _) => o.status === 'REJECTED')
	rejection_reason?: string;
}
