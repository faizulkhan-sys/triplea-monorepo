import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseDto } from './Base.dto';

/**
 *
 *
 * @export
 * @class SetPassword
 * @extends {PickType(BaseDto, ['password'] as const)}
 */
export class SetPassword extends PickType(BaseDto, ['password'] as const) {
	@ApiProperty({
		description: ' Token from email',
		example: 'test@1234',
	})
	@IsNotEmpty({ message: 'Token cannot be empty' })
	token: string;
}
