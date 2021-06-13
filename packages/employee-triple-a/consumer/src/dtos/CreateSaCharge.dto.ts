import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateSaChargeDto {
  @IsNotEmpty({ message: 'Charge name should not empty' })
  @Length(3, 30, {
    message: 'Charge name must be between 3 and 30 characters long',
  })
  @Matches(/^[-_ a-zA-Z0-9]+$/, {
    message: 'Charge name must be alphanumeric',
  })
  name: string;

  @IsNotEmpty({ message: 'Charge value should not empty' })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  charge_value: number;

  @IsIn(['PERCENT', 'FLAT'], {
    message: 'Value must be either Percent or Flat',
  })
  charge_type: string;

  @IsNotEmpty({ message: 'Is default should not empty' })
  @IsBoolean({ message: 'Is default should be boolean' })
  is_default_charge: boolean;

  @ValidateIf((o) => o.is_default_charge.toString() === 'false')
  @IsString()
  expires_on?: string;

  @ValidateIf((o) => o.is_default_charge.toString() === 'false')
  @IsUUID('all', { message: 'Default charge Idx must be an uuid' })
  default_charge_idx?: string;

  @IsIn(['EMPLOYEE', 'EMPLOYER'], {
    message: 'Invalid charge payer',
  })
  charge_payer: string;
}
