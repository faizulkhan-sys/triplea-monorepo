import { Exclude, Transform } from 'class-transformer';
import {
	AfterLoad,
	Column,
	Entity,
	Generated,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { CustomerDevice } from './CustomerDevice.entity';
import { EmployeeCardInfoEntity } from './EmployeeCardInfo.entity';
import { EmployeeDailyLogEntity } from './EmployeeDailyLogInfo.entity';
import { EmployeePlaidInfo } from './EmployeePlaidInfo.entity';
import config from '@config/index';

@Index(['employee_id', 'email'], { unique: true })
@Entity('Customer', { schema: 'dbo' })
export class Customer {
	private full_name: string;

	@AfterLoad()
	getUrl() {
		this.full_name = `${this.first_name} ${this.middle_name} ${this.last_name}`;

		if (this.middle_name || this.middle_name !== ' ') {
			this.full_name = `${this.first_name} ${this.last_name}`;
		}
	}

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

	@Column('varchar', { length: 150, name: 'first_name' })
	first_name: string;

	@Column('varchar', { length: 150, name: 'middle_name', nullable: true })
	middle_name: string | null;

	@Column('varchar', { length: 150, name: 'last_name' })
	last_name: string;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', { length: 150, name: 'password', nullable: true })
	password: string | null;

	@Column('bit', {
		name: 'is_password_set',
		default: () => '(0)',
	})
	is_password_set: boolean;

	@Column('varchar', { length: 150, name: 'email' })
	email: string;

	@Column('varchar', { length: 150, name: 'gender', nullable: true })
	gender: string | null;

	@Column('varchar', {
		length: 150,
		name: 'phone_number',
		default: () => 'N/A',
	})
	phone_number: string;

	@Column('varchar', {
		length: 150,
		name: 'phone_number_ext',
		nullable: true,
	})
	phone_number_ext: string | null;

	@Column('varchar', { length: 150, name: 'zip_code' })
	zip_code: string;

	@Column('varchar', { length: 150, name: 'hourly_rate' })
	hourly_rate: string;

	@Column('varchar', { length: 150, name: 'pay_rate', nullable: true })
	pay_rate: string;

	@Column('varchar', { length: 200, name: 'fcm_key', nullable: true })
	fcm_key: string | null;

	@Column('varchar', { length: 150, name: 'platform', nullable: true })
	platform: string | null;

	@Column('varchar', { length: 150, name: 'google_id', nullable: true })
	google_id: string | null;

	@Column('varchar', { length: 150, name: 'fb_id', nullable: true })
	fb_id: string | null;

	@Column('varchar', { length: 150, name: 'employer_id' })
	employer_id: string;

	@Transform(({ value }) => value.slice(value.length - 5), {
		toPlainOnly: true,
	})
	@Column('varchar', { length: 150, name: 'ssn_no', nullable: true })
	ssn_no: string | null;

	@Column('date', { name: 'date_of_birth', nullable: true })
	date_of_birth: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'worker_status_type',
		default: () => 'N/A',
	})
	worker_status_type: string;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'worker_status_reason',
		default: () => 'N/A',
	})
	worker_status_reason: string;

	@Column('bit', {
		name: 'is_bank_set',
		nullable: false,
		default: () => '(0)',
	})
	is_bank_set: boolean;

	@Column('datetime', {
		name: 'created_on',
		default: () => 'getdate()',
	})
	created_on: Date;

	@Column('bit', {
		name: 'is_active',
		nullable: true,
		default: () => '(1)',
	})
	is_active: boolean | null;

	@Column('bit', {
		name: 'is_debitcard',
		nullable: true,
		default: () => '(0)',
	})
	is_debitcard: boolean | null;

	@Column('varchar', {
		length: 150,
		name: 'mobile_number_ext',
		nullable: true,
	})
	mobile_number_ext: string | null;

	@OneToMany(
		() => CustomerDevice,
		customerDevice => customerDevice.customer_id,
		{
			cascade: true,
		},
	)
	customerDevices: CustomerDevice[];

	@Column('bit', {
		name: 'is_first_time_import',
		default: () => '(0)',
	})
	is_first_time_import: boolean;

	@Column('bit', {
		name: 'is_mpin_set',
		default: () => '(0)',
	})
	is_mpin_set: boolean;

	@Column('varchar', {
		length: 100,
		name: 'mpin',
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	mpin: string | null;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'is_invited',
	})
	is_invited: boolean;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'is_registered',
	})
	is_registered: boolean;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'sa_approved',
	})
	sa_approved: boolean;

	@Column('varchar', {
		nullable: false,
		default: () => 'INACTIVE',
		name: 'sa_status',
	})
	sa_status: string;

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

	@Column('varchar', { length: 150, name: 'employee_id' })
	employee_id: string;

	@Column('varchar', { length: 150, name: 'worker_id', nullable: true })
	worker_id: string;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', { nullable: true, name: 'last_synced' })
	last_synced: Date | null;

	@Column('varchar', { name: 'worker_type', length: 255, nullable: true })
	worker_type: string;

	@Column('varchar', { name: 'employment_type', length: 255, nullable: true })
	employment_type: string;

	@Exclude({ toPlainOnly: true })
	@Column({ name: 'sort_order', type: 'int', default: 3, nullable: false })
	sort_order: number;

	@Column('varchar', {
		name: 'residential_address',
		length: 1000,
		nullable: true,
	})
	residential_address: string;

	@Column('varchar', { length: 150, name: 'mobile_number', nullable: true })
	mobile_number: string | null;

	@Column('varchar', { name: 'department', length: 250, nullable: true })
	department: string;

	@Column('varchar', { name: 'salary_type', length: 2000, nullable: true })
	salary_type: string;

	@Column('varchar', { name: 'pay_frequency', length: 2000, nullable: true })
	pay_frequency: string;

	@OneToMany(() => EmployeePlaidInfo, plaid_info => plaid_info.customer, {
		cascade: true,
	})
	plaid_infos: EmployeePlaidInfo[];

	@OneToMany(() => EmployeeCardInfoEntity, card_info => card_info.customer, {
		cascade: true,
	})
	card_infos: EmployeeCardInfoEntity[];

	@OneToMany(() => EmployeeDailyLogEntity, daily_log => daily_log.customer, {
		cascade: true,
	})
	daily_logs: EmployeeDailyLogEntity[];
}
