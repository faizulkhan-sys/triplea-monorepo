import { Exclude } from 'class-transformer';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Protocol_User', { schema: 'dbo' })
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
		nullable: false,
		length: 150,
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
		name: 'mpin_attempt_interval',
	})
	mpin_attempt_interval: number;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'mpin_interval_unit',
	})
	mpin_interval_unit: string;

	@Column('int', {
		nullable: true,
		name: 'pwexpiry_interval',
	})
	pwexpiry_interval: number;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'pwexpiry_interval_unit',
	})
	pwexpiry_interval_unit: string;

	@Column('int', {
		nullable: true,
		name: 'mpin_max_retry',
	})
	mpin_max_retry: number;

	@Column('integer', { name: 'pw_minimum_length', nullable: true })
	pw_minimum_length: number | null;

	@Column('integer', { name: 'pw_maximum_length', nullable: true })
	pw_maximum_length: number | null;

	@Column('integer', { name: 'otp_expiry_in_minutes', nullable: true })
	otp_expiry_in_minutes: number | null;

	@Column('bit', {
		name: 'lower_case_required',
		nullable: true,
		default: () => '(1)',
	})
	lower_case_required: boolean | null;

	@Column('bit', { name: 'upper_case_required', nullable: true })
	upper_case_required: boolean | null;

	@Column('bit', { name: 'numeric_case_required', nullable: true })
	numeric_case_required: boolean | null;

	@Column('bit', { name: 'special_character_required', nullable: true })
	special_character_required: boolean | null;

	@Column('integer', { name: 'pw_repeatable_after', nullable: true })
	pw_repeatable_after: number | null;

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
