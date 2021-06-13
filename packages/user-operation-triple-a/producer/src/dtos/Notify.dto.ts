import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from './Base.dto';

/**
 *
 *
 * @export
 * @class NotifyDto
 * @extends {PickType(BaseDto, ['employer_email'] as const)}
 */
export class NotifyDto extends PickType(BaseDto, ['employer_email'] as const) {
	@ApiProperty({
		description: 'Notify ',
		example: 'true',
	})
	@IsNotEmpty()
	notify: boolean;
}
