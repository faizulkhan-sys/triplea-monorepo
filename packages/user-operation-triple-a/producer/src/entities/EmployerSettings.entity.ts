import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('EmployerSettings', { schema: 'dbo' })
export class EmployerSettings {
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
	idx: string;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'auto_approve',
	})
	auto_approve: boolean;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'auto_invite',
	})
	auto_invite: boolean;

	@Column('varchar', {
		nullable: false,
		length: 100,
		name: 'created_by',
	})
	created_by: string;

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

	constructor(auto_approve: boolean, auto_invite: boolean) {
		this.auto_approve = auto_approve;

		this.auto_invite = auto_invite;
	}
}
