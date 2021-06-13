import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionUserType } from './PermissionUserType';
import { Users } from './Users';
import { UsersTemp } from './UsersTemp';

@Entity('UserType', { schema: 'dbo' })
export class UserType {
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
		name: 'user_type',
	})
	user_type: string | null;

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'description',
	})
	description: string | null;

	@OneToMany(
		() => PermissionUserType,
		permissionUserType => permissionUserType.userType,
	)
	permissionsUserType: PermissionUserType[];

	@OneToMany(() => Users, users => users.user_type)
	users: Users[];

	@OneToMany(() => UsersTemp, usersTemp => usersTemp.user_type)
	usersTemps: UsersTemp[];

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

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

	constructor(user_type?: string, description?: string) {
		this.user_type = user_type || '';
		this.description = description || '';
	}
}
