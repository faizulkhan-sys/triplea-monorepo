import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionUserType } from './PermissionUserType';
import { PermissionUserTypeTemp } from './PermissionUserTypeTemp';

@Entity('Permission', { schema: 'dbo' })
export class Permission {
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
		nullable: false,
		length: 150,
		name: 'base_name',
	})
	base_name: string;

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'url',
	})
	url: string;

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'method',
	})
	method: string;

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
		nullable: true,
		length: 150,
		name: 'permission_type',
	})
	permission_type: string | null;

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'alias',
	})
	alias: string;

	@OneToMany(
		() => PermissionUserType,
		permissionUserType => permissionUserType.permission,
	)
	permissionUserType: PermissionUserType[];

	@OneToMany(
		() => PermissionUserType,
		permissionRoleTemp => permissionRoleTemp.permission,
	)
	permissionRoleTemps: PermissionUserTypeTemp[];

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
