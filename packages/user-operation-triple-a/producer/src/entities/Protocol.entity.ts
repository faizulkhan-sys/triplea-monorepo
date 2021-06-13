import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('Protocol_Employee', { schema: 'dbo' })
export class Protocol {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('uuid', {
		nullable: false,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string | null;

	@Column('int', {
		nullable: false,
		name: 'login_attempt_interval',
	})
	login_attempt_interval: number;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'login_interval_unit',
	})
	login_interval_unit: string;

	@Column('int', {
		nullable: false,
		name: 'login_max_retry',
	})
	login_max_retry: number;

	@Column('int', {
		nullable: true,
		name: 'otp_expiry_in_minutes',
	})
	otp_expiry_in_minutes: number;

	@Column('int', {
		nullable: true,
		name: 'mpin_attempt_interval',
	})
	mpin_attempt_interval: number;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'mpin_interval_unit',
	})
	mpin_interval_unit: string;

	@Column('int', {
		nullable: true,
		name: 'mpin_max_retry',
	})
	mpin_max_retry: number;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

	@Column('bit', {
		nullable: false,
		default: () => '(1)',
		name: 'is_active',
	})
	is_active: boolean;

	@Exclude({ toPlainOnly: true })
	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'is_obsolete',
	})
	is_obsolete: boolean;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;
}
