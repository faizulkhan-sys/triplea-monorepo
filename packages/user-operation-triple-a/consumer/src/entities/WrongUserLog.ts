import { Exclude } from 'class-transformer';
import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity('WrongUserLog', { schema: 'dbo' })
export class WrongUserLog {
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

	@Column('varchar', {
		nullable: true,
		length: 255,
		name: 'employer_id',
	})
	employer_id: string | null;

	@Column('varchar', {
		nullable: true,
		length: 300,
		name: 'zip_code',
	})
	zip_code: string | null;

	@Column('varchar', {
		nullable: true,
		length: 255,
		name: 'employee_id',
	})
	employee_id: string | null;

	@Column('varchar', {
		nullable: true,
		length: 300,
		name: 'ssn_no',
	})
	ssn_no: string | null;

	@Column('varchar', {
		nullable: true,
		length: 255,
		name: 'employee_email',
	})
	employee_email: string | null;

	@Column('varchar', {
		nullable: true,
		length: 255,
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

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;
}
