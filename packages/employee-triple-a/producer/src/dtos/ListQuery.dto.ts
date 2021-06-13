import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListQueryDto {
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Page'
	})
	@Transform(({ value }) => Number(value), { toClassOnly: true })
	@IsNumber()
	page = 1;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Limit'
	})
	@Transform(({ value }) => Number(value), { toClassOnly: true })
	@IsNumber()
	limit = 10;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Search'
	})
	@IsString()
	search = '';

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Status'
	})
	@IsString()
	status = '';
}
