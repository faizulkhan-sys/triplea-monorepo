import { IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseDto } from './Base.dto';

/**
 *
 *
 *
 * @export
 * @class ChangeUserPass
 * @extends {PickType(BaseDto, ['password'] as const)}
 */
export class ChangeUserPass extends PickType(BaseDto, ['password'] as const) {
	@ApiProperty({
		description: 'Current password',
		example: 'test@1234',
	})
	@IsNotEmpty({ message: 'Current password cannot be empty' })
	@Length(8, 64, {
		message: 'Password must be between 6 to 64 characters long',
	})
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Password must contain at least 1 special character,uppercase letter, lowercase letter and number each',
		},
	)
	current_password: string;
}
