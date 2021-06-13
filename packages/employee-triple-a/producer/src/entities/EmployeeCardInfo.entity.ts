import {
	BaseEntity,
	Column,
	Entity,
	Generated,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { Customer } from './Customer.entity';
import config from '../config';
import { EncryptionTransformer } from 'typeorm-encrypted';

@Index(['idx'], { unique: true })
@Entity('EmployeeCardInfo', {})
export class EmployeeCardInfoEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
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

	@ManyToOne(() => Customer, customer => customer.plaid_infos, {
		eager: false,
	})
	customer: Customer;

	@Transform(({ value }) => value.slice(value.length - 5), {
		toPlainOnly: true,
	})
	@Column('varchar', {
		length: 1000,
		name: 'card_number',
		nullable: false,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	card_number: string | null;

	@Exclude({ toPlainOnly: true })
	@Column('datetime', {
		nullable: false,
		name: 'expiry_date',
	})
	expiry_date: Date | null;

	@Column('varchar', {
		length: 150,
		name: 'cvv',
		nullable: true,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	cvv: string | null;

	@Column('varchar', {
		length: 150,
		name: 'pin',
		nullable: true,
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	pin: string | null;

	@Column('varchar', { name: 'type', length: 200 })
	type: string;

	@Column('varchar', { name: 'tabapay_account_id', length: 200 })
	tabapay_account_id: string;
}
