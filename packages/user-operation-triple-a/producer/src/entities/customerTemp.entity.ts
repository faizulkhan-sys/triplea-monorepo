import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('CustomerTemp', { schema: 'dbo' })
export class CustomerTemp {
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
		length: 150,
		nullable: false,
		name: 'mobile_number_ext',
	})
	mobile_number_ext: string;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'first_name',
	})
	first_name: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'middle_name',
	})
	middle_name: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'last_name',
	})
	last_name: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'email',
	})
	email: string | null;

	@Column('bigint', {
		nullable: true,
		name: 'customer_id',
	})
	customer_id: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'gender',
	})
	gender: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'mobile_number',
	})
	mobile_number: string | null;

	@Column('date', {
		nullable: true,
		name: 'date_of_birth',
	})
	date_of_birth: string | null;

	@Column('varchar', { length: 150, name: 'zip_code', nullable: true })
	zip_code: string | null;

	@Column('varchar', { length: 150, name: 'hourly_rate', nullable: true })
	hourly_rate: string | null;

	@Column('varchar', { length: 150, name: 'ssn_no', nullable: true })
	ssn_no: string | null;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'status',
	})
	status: string;

	@Column('uuid', {
		nullable: true,
		name: 'created_by',
	})
	created_by: string | null;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'operation',
	})
	operation: string;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'rejection_reason',
	})
	rejection_reason: string;

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
