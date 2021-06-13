import {
	Column,
	Entity,
	Generated,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Customer } from './Customer.entity';

@Entity('ActivityLog_Employee', { schema: 'dbo' })
export class ActivityLog {
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

	@ManyToOne(() => Customer)
	@JoinColumn()
	user: Customer;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'activity_type',
	})
	activity_type: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'login_type',
	})
	login_type: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'ip_address',
	})
	ip_address: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'device_id',
	})
	device_id: string | null;

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
		nullable: true,
		name: 'status',
	})
	status: boolean;

	@Column('bit', {
		nullable: true,
		name: 'login_status',
	})
	login_status: boolean;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;
}
