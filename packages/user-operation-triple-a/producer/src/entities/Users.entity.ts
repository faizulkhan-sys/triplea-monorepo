import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['employer_no', 'company_id', 'display_id'], { unique: true })
@Entity('Users', { schema: 'dbo' })
export class Users {
	@Column('uuid', {
		nullable: false,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'username',
	})
	username: string;

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'contact_name',
	})
	contact_name: string;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'password',
	})
	password: string;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'email',
	})
	email: string | null;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'address',
	})
	address: string | null;

	@Column('varchar', {
		nullable: true,
		length: 50,
		name: 'phone_number',
	})
	phone_number: string | null;

	@Column('varchar', { length: 150, name: 'company_id', nullable: true })
	company_id: string;

	@Column('varchar', { length: 150, name: 'display_id', nullable: true })
	display_id: string;

	@Column('varchar', { length: 250, name: 'legal_name', nullable: true })
	legal_name: string;

	@Column('varchar', {
		nullable: false,
		length: 50,
		name: 'employer_no',
	})
	employer_no: string | null;

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

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'fb_id',
	})
	fb_id: string | null;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'google_id',
	})
	google_id: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'zip_code',
	})
	zip_code: string | null;

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
		name: 'is_superadmin',
	})
	is_superadmin: boolean;

	// @OneToMany(() => CompanyUserEntity, (CompanyUser: CompanyUserEntity) => CompanyUser.user)
	// companyUsers: CompanyUserEntity[];
	//
	// @OneToMany(() => UsersTempEntity, usersTemp => usersTemp.user)
	// usersTemps: UsersTempEntity[];

	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;
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

	constructor(
		contact_name?: string,
		email?: string,
		zip_code?: string,
		company_name?: string,
		is_superadmin?: boolean,
	) {
		this.contact_name = contact_name || '';
		this.email = email || '';
		this.zip_code = zip_code || '';
		this.company_name = company_name || '';
		this.is_superadmin = is_superadmin || false;
	}
}
