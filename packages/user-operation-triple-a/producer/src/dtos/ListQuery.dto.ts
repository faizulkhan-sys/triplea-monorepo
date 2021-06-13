import { PickType ,ApiPropertyOptional} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 *
 *
 * @export
 * @class ListQueryBaseDto
 */
export class ListQueryBaseDto {
	@ApiPropertyOptional({description:"page"})
	@IsOptional()
	@Transform(({ value }) => Number(value), { toClassOnly: true })
	@IsNumber()
	page = 1;

	@ApiPropertyOptional({description:"limit"})
	@IsOptional()
	@Transform(({ value }) => Number(value), { toClassOnly: true })
	@IsNumber()
	limit = 10;

	@ApiPropertyOptional({description:"search"})
	@IsOptional()
	@IsString()
	search = '';

	@ApiPropertyOptional({description:"status"})
	@IsOptional()
	@IsString()
	status = '';

	@ApiPropertyOptional({description:"request type"})
	@IsOptional()
	@IsString()
	request_type = '';
}

/**
 *
 *
 * @export
 * @class ListActiveUserDto
 * @extends {PickType(ListQueryBaseDto, [
 * 	'page',
 * 	'limit',
 * 	'search',
 * 	'status',
 * ] as const)}
 */
export class ListActiveUserDto extends PickType(ListQueryBaseDto, [
	'page',
	'limit',
	'search',
	'status',
] as const) {
	@ApiPropertyOptional({description:"user type"})
	@IsOptional()
	@IsString()
	user_type = '';
}

/**
 *
 *
 * @export
 * @class ListActiveUserTypeDto
 * @extends {PickType(ListQueryBaseDto, [
 * 	'page',
 * 	'limit',
 * 	'search',
 * ] as const)}
 */
export class ListActiveUserTypeDto extends PickType(ListQueryBaseDto, [
	'page',
	'limit',
	'search',
] as const) {}

/**
 *
 *
 * @export
 * @class ListPendingDto
 * @extends {PickType(ListQueryBaseDto, [
 * 	'page',
 * 	'limit',
 * 	'search',
 * 	'request_type'
 * ] as const)}
 */
export class ListPendingDto extends PickType(ListQueryBaseDto, [
	'page',
	'limit',
	'search',
	'request_type',
] as const) {}
