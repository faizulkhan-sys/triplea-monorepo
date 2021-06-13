import {
	Column,
	Entity,
	Generated,
	Index,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { Exclude } from 'class-transformer';
import { EncryptionTransformer } from 'typeorm-encrypted';
import config from '@config/index';

@Entity('CustomerDevice', { schema: 'dbo' })
@Index(['idx'], { unique: true })
export class CustomerDevice {
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

	@OneToOne(() => Customer, customer => customer.id, {})
	@JoinColumn({ name: 'customer_id' })
	customer_id: bigint;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'phone_brand',
	})
	phone_brand: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'phone_os',
	})
	phone_os: string | null;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'os_version',
	})
	os_version: string | null;

	@Column('varchar', {
		length: 150,
		name: 'deviceid',
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	deviceid: string;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'fcm_token',
	})
	fcm_token: string;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'otp',
	})
	otp: string;

	@Column('varchar', {
		length: 150,
		name: 'token',
	})
	token: string;

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'otp_type',
	})
	otp_type: string | null;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
		name: 'otp_status',
	})
	otp_status: boolean;

	@Column('bigint', {
		nullable: true,
		default: () => '0',
		name: 'total_attempt',
	})
	total_attempt: string | null;

	@Column('datetime', {
		nullable: false,
		name: 'otp_created_at',
	})
	otp_created_at: Date;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

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
