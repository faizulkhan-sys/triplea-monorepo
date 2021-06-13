import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 *
 *
 * @export
 * @class EnableDisable
 */
export class EnableDisable {
	@ApiProperty({
		description: 'operation either ENABLE or DISABLE',
		example: 'BLOCK',
	})
	@IsIn(['ENABLE', 'DISABLE'], {
		message: 'Value must be either ENABLE or DISABLE',
	})
	operation: string;
}
