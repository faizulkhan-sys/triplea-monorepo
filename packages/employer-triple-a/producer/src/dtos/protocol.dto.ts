import { IsOptional } from '@common/customOptional';
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
		description: 'Login Interval Unit'
	})
	@IsIn(['h', 'd', 'w', 'M', 'y'], {
		message: 'login_interval_unit be either h,d,w,M,y',
	})
	login_interval_unit?: string;

	@IsOptional()
	@ApiPropertyOptional({
		description: 'Login Max Retry'
	})
	@IsNumber()
	login_max_retry?: number;
}
