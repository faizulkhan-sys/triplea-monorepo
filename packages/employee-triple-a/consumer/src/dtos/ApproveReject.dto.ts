import { IsOptional } from '@common/customOptional';
import { IsIn } from 'class-validator';

export class ApproveRejectDto {
  @IsIn(['APPROVE', 'REJECT'], {
    message: 'Value must be either APPROVE or REJECT',
  })
  action: string;

  @IsOptional()
  rejection_reason: string;
}
