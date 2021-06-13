import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FcmDto {
	@ApiProperty({
		description: 'fcm key',
	})
	@IsNotEmpty({ message: 'fcm key is required' })
	fcm_key: string;

	@ApiProperty({
		description: 'platform',
	})
	@IsNotEmpty({ message: 'platform is required' })
	platform: string;
}
