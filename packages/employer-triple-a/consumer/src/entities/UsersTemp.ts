import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { UserType } from './UserType';

@Entity('UsersTemp', { schema: 'dbo' })
export class UsersTemp {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('uuid', {
		nullable: true,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string | null;

	@ManyToOne(() => UserType, userType => userType.usersTemps, {})
	@JoinColumn({ name: 'user_type' })
	user_type: UserType | null;

	@Column('varchar', {
		nullable: true,
		name: 'username',
	})
	username: string | null;

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'contact_name',
	})
	contact_name: string;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'employee_email',
	})
	employee_email: string;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		name: 'password',
	})
	password: string | null;

	@Column('varchar', {
		length: 150,
		name: 'time_management_system',
		nullable: true,
	})
	time_management_system: string | null;

	@Column('varchar', {
		length: 150,
		name: 'company_internalhr_system',
		nullable: true,
	})
	company_internalhr_system: string | null;

	@Column('varchar', {
		length: 150,
		name: 'payroll_system',
		nullable: true,
	})
	payroll_system: string | null;

	@Column('varchar', {
		nullable: true,
		name: 'email',
	})
	email: string | null;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		name: 'address',
	})
	address: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'zip_code',
	})
	zip_code: string | null;

	@Column('varchar', {
		nullable: true,
		length: 50,
		name: 'phone_number',
	})
	phone_number: string | null;

	@Column('varchar', {
		nullable: true,
		length: 10,
		name: 'phone_ext',
	})
	phone_ext: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'company_name',
	})
	company_name: string | null;

	@ManyToOne(() => Users, users => users.usersTemps, {})
	@JoinColumn({ name: 'user_id' })
	user: Users | null;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'is_superadmin',
	})
	is_superadmin: boolean;

	@Column('varchar', {
		nullable: true,
		name: 'operation',
	})
	operation: string | null;

	@Column('varchar', {
		nullable: true,
		name: 'created_by',
	})
	created_by: string | null;

	@Column('varchar', {
		nullable: true,
		name: 'status',
	})
	status: string | null;

	@Column('bit', {
		name: 'receive_questionare_form',
	})
	receive_questionare_form: boolean;

	@Column('bit', {
		name: 'receive_signed_agreement',
	})
	receive_signed_agreement: boolean;

	@Column('varchar', {
		nullable: true,
		name: 'rejection_reason',
	})
	rejection_reason: string | null;

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

	@Column('varchar', { length: 150, name: 'company_id', nullable: true })
	company_id: string;

	@Column('varchar', { length: 150, name: 'display_id', nullable: true })
	display_id: string;

	@Column('varchar', { length: 250, name: 'legal_name', nullable: true })
	legal_name: string;

	@Column('varchar', {
		nullable: true,
		length: 50,
		name: 'employer_no',
	})
	employer_no: string | null;

	constructor(
		contact_name?: string,
		email?: string,
		zip_code?: string,
		company_name?: string,
		status?: string,
		user?: Users,
	) {
		this.contact_name = contact_name || '';
		this.email = email || '';
		this.zip_code = zip_code || '';
		this.company_name = company_name || '';
		this.status = status || 'PENDING';
		this.user = user || null;
	}
}
