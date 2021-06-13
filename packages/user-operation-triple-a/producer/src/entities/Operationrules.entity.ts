import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('operationrules', { schema: 'dbo' })
export class Operationrules {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('varchar', { length: 150, name: 'operation_type' })
	operationType: string;

	@Column('varchar', { length: 150, name: 'period' })
	period: string;

	@Column('varchar', { length: 150, name: 'period_unit' })
	periodUnit: string;

	@Column('integer', { name: 'attempts' })
	attempts: number;
}
