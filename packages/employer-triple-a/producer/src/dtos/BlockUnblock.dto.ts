import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 *
 *
 * @export
 * @class BlockUnblock
 */
export class BlockUnblock {
	@ApiProperty({
		description: 'operation either BLOCK or UNBLOCK',
		example: 'BLOCK',
	})
	@IsIn(['BLOCK', 'UNBLOCK'], {
		message: 'Value must be either BLOCK or UNBLOCK',
	})
	operation: string;
}
