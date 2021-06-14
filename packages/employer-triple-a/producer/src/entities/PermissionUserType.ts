import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './Permission';
import { UserType } from './UserType';

@Entity('PermissionUserType', { schema: 'dbo' })
export class PermissionUserType {
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

	@ManyToOne(() => UserType, userType => userType.permissionsUserType, {
		nullable: false,
	})
	@JoinColumn({ name: 'user_type' })
	userType: UserType | null;

	@ManyToOne(() => Permission, permission => permission.permissionUserType, {
		nullable: false,
	})
	@JoinColumn({ name: 'permission_id' })
	permission: Permission | null;

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

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'permission_base_name',
	})
	base_name: string | null;

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