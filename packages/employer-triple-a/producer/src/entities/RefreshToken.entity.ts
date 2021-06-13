import {
	BaseEntity,
	Column,
	Entity,
	Generated,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Users } from '@entities/Users';

@Entity('EmployeeRefreshTokens', { schema: 'dbo' })
export class RefreshTokens extends BaseEntity {
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
	@JoinColumn()
	user: Users;

	@Column('datetime', {
		nullable: false,
		name: 'expires_in',
	})
	expires_in: Date;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'is_revoked',
	})
	is_revoked: boolean;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;
}
