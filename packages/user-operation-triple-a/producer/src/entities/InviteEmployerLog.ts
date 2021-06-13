import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('InviteEmployerLog', { schema: 'dbo' })
export class InviteEmployerLog {
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

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'employer_email',
	})
	employer_email: string | null;

	@Expose({ name: 'invited_by' })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'employee_email',
	})
	employee_email: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'status',
	})
	status: string | null;

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

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'notify',
	})
	notify: boolean;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;
}
