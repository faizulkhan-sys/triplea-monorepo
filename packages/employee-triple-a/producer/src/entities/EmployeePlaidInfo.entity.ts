import {
	BaseEntity,
	Column,
	Entity,
	Generated,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Customer } from './Customer.entity';
import { EncryptionTransformer } from 'typeorm-encrypted';
import config from '@config/index';

@Index(['idx'], { unique: true })
@Entity('EmployeePlaidInfo', { schema: 'dbo' })
export class EmployeePlaidInfo extends BaseEntity {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('uuid', { name: 'idx' })
	@Generated('uuid')
	idx: string;

	@Column('datetime', {
		name: 'created_on',
		nullable: false,
		default: () => 'getdate()',
	})
	created_on: Date;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: true,
		default: () => 'getdate()',
		name: 'modified_on',
	})
	modified_on: Date | null;

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

	@ManyToOne(() => Customer, customer => customer.plaid_infos, {
		eager: false,
	})
	customer: Customer;

	@Column('varchar', { name: 'bank_name', length: 250, nullable: true })
	bank_name: string;

	@Column('varchar', { name: 'access_token', length: 2000 })
	access_token: string;

	@Column('varchar', { name: 'item_id', length: 2000 })
	item_id: string;

	@Column('varchar', {
		name: 'account',
		length: 2000,
		nullable: true,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	account: string;

	@Column('varchar', {
		name: 'account_id',
		length: 2000,
		nullable: true,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	account_id: string;

	@Column('varchar', {
		name: 'routing',
		length: 2000,
		nullable: true,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	routing: string;

	@Column('varchar', {
		name: 'wire_routing',
		length: 2000,
		nullable: true,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	wire_routing: string;
}
