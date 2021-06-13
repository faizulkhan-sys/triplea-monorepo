import { IsOptional } from '@common/others/customOptional';
import { IsBoolean, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFilterDto {
	@IsOptional()
	@IsString()
	@Length(6, 64)
	@ApiPropertyOptional({
		description: 'Name'
	})
	@Matches(/^[-_ a-zA-Z0-9]+$/i, {
		message: 'Name must be alphanumeric',
	})
	name: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: 'Value'
	})
	value: string;

	@IsOptional()
	@IsUUID('all')
	@ApiPropertyOptional({
		description: 'Criteria'
	})
	criteria: unknown;

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional({
		description: 'Is active'
	})
	is_active: boolean;
}
