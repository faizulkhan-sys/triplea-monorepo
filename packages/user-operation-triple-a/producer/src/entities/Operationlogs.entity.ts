import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['idx'], { unique: true })
@Entity('operationlogs', { schema: 'dbo' })
export class Operationlogs {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('uuid', { name: 'customer_idx' })
	customerIdx: string;

	@Column('uuid', {
		name: 'token',
	})
	@Generated('uuid')
	token: string;

	@Column('varchar', { length: 150, name: 'operation_type' })
	operationType: string;

	@Column('varchar', { length: 150, name: 'status', nullable: false })
	status: string;

	@Column('uuid', {
		nullable: false,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string;
}
