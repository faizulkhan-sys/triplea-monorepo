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

@Index(['idx'], { unique: true })
@Entity('EmployeeDailyLog', { schema: 'dbo' })
export class EmployeeDailyLogEntity extends BaseEntity {
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

	@Exclude({ toPlainOnly: true })
	@Column('date', {
		nullable: false,
		default: () => 'getdate()',
		name: 'work_date',
	})
	work_date: Date | null;

	@Column('varchar', { length: 150, name: 'hours_worked' })
	hours_worked: string;

	@Column('varchar', { length: 150, name: 'earned_amount' })
	earned_amount: string;
}
