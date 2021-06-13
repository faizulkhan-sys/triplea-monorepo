import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilterDto {
	@IsNotEmpty()
	@IsString()
	@Length(6, 64)
	@Matches(/^[-_ a-zA-Z0-9]+$/, {
		message: 'Name must be alphanumeric',
	})
	@ApiProperty({
		description: 'Name'
	})
	name: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({
		description: 'Value'
	})
	value: string;

	@IsNotEmpty()
	@IsUUID('all')
	@ApiProperty({
		description: 'Criteria'
	})
	criteria: string;
}
