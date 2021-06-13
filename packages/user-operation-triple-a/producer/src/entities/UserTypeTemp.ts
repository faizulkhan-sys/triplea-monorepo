import {
	Column,
	Entity,
	Generated,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionUserTypeTemp } from './PermissionUserTypeTemp';
import { Exclude } from 'class-transformer';
import { UserType } from './UserType';

@Entity('UserTypeTemp', { schema: 'dbo' })
@Index('UserTypeTemp_idx_key', ['idx'], { unique: true })
export class UserTypeTemp {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('uuid', {
		nullable: false,
		unique: true,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'description',
	})
	description: string | null;

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

	@ManyToOne(() => UserType, userType => userType.user_type, {})
	@JoinColumn({ name: 'usertype_id' })
	userType: UserType | null;

	@Column('varchar', {
		nullable: true,
		name: 'user_type',
		length: 100,
	})
	user_type: string | null;

	@Column('uuid', {
		nullable: false,
		name: 'created_by',
	})
	created_by: string;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'status',
	})
	status: string | null;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'alias',
	})
	alias: string | null;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'operation',
	})
	operation: string | null;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'rejection_reason',
	})
	rejection_reason: string | null;

	@OneToMany(
		() => PermissionUserTypeTemp,
		permissionUserTypeTemp => permissionUserTypeTemp.usertype,
	)
	permissionUserTypeTemps: PermissionUserTypeTemp[];

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
