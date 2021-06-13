import { IsOptional } from '@common/customs/customOptional';
import { IsIn, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 *
 *
 * @export
 * @class ProtocolUpdateDto
 */
export class ProtocolUpdateDto {
	@IsOptional()
	@ApiPropertyOptional({
		description: 'Login attempt interval'
	})
	@IsNumber()
	login_attempt_interval?: number;

	/**
 years	y
months	M
weeks	w
days	d
hours	h
minutes	m
seconds	s
milliseconds	ms
	 */

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Login interval unit'
	})
	@IsIn(['h', 'd', 'w', 'M', 'y'], {
		message: 'login_interval_unit be either h,d,w,M,y',
	})
	login_interval_unit?: string;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Login max retry'
	})
	@IsNumber()
	login_max_retry?: number;
}
