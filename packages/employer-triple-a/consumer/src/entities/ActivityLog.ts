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

@Entity('ActivityLog_User', { schema: 'dbo' })
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

	@ManyToOne(() => Users)
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	user_id: Users;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'activity_type',
	})
	activity_type: string | null;

	@Column('bit', {
		nullable: true,
		name: 'login_status',
	})
	login_status: boolean | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'login_type',
	})
	login_type: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'ip_address',
	})
	ip_address: string | null;

	@Column('varchar', {
		nullable: true,
		length: 150,
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

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;
}
