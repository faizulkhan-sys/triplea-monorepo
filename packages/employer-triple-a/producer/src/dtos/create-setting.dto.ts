import { IsOptional } from '@common/customOptional';
import { IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddUpdatesettings {
	@ApiPropertyOptional({
		description: 'Auto Approve'
	})
	@IsOptional()
	@IsBoolean({ message: 'Auto approve must be boolean' })
	auto_approve: boolean;

	@ApiPropertyOptional({
		description: 'Auto Invite'
	})
	@IsOptional()
	@IsBoolean({ message: 'Auto invite must be boolean' })
	auto_invite: boolean;
}
