import {
	Column,
	Entity,
	Generated,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('Answers', { schema: 'dbo' })
@Index(['idx'], { unique: true })
export class Answers {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

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

	@Column('uuid', {
		nullable: false,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string;

	@Column('bigint', {
		nullable: false,
		name: 'customer_id',
	})
	customer_id: string;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'question',
	})
	question: number;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'answer',
	})
	answer: string;

	@Column('bit', {
		nullable: false,
		default: () => '(1)',
		name: 'is_active',
	})
	is_active: boolean;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;
}
