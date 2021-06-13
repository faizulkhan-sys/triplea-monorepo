import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, ValidateIf } from 'class-validator';

export class EmployeeLoginDto {
	@ApiProperty({
		description:
			'Login type , 0 for password login , 1 for facebook and 2 for gmail',
		example: 0,
	})
	@IsNotEmpty()
	@IsIn([0, 1, 2], { message: 'Login type can only be 0,1,2' })
	public login_type: number;

	@ApiProperty({
		description: 'Username or email, case 0',
		example: 'orbis@gmail.com',
	})
	@ValidateIf((o, _) => o.login_type === 0)
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be a valid email' })
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	public email?: string;

	@ApiProperty({
		description: 'Password, case 0',
		example: 'test@1234',
	})
	@ApiProperty()
	@ValidateIf((o, _) => o.login_type === 0)
	@IsNotEmpty()
	public password?: string;

	@ApiProperty({
		description:
			'Login id , which is either facebook or gmail id, case 1 or 2',
		example: '1234',
	})
	@ValidateIf((o, _) => o.login_type === 1 || o.login_type === 2)
	@IsNotEmpty()
	public login_id?: number;
}
