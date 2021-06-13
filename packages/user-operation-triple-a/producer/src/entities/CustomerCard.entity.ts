import {
	Column,
	Entity,
	Generated,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { EncryptionTransformer } from 'typeorm-encrypted';
import config from '@config/index';

@Index(['membership_number', 'idx', 'customer_idx'], { unique: true })
@Entity('CustomerCard', { schema: 'dbo' })
export class CustomerCard {
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

	@Column('uuid', {
		name: 'customer_idx',
	})
	customer_idx: string;

	@Column('varchar', { name: 'membership_type', length: 16 })
	membership_type: string;

	@Column('varchar', {
		length: 150,
		name: 'membership_number',
		transformer: new EncryptionTransformer({
			key: config.db.key,
			algorithm: 'aes-256-cbc',
			ivLength: 16,
		}),
	})
	membership_number: string;

	@Column('date', { name: 'valid_till' })
	valid_till: string;

	@Column('integer', { name: 'reward_point' })
	reward_point: number;
}
