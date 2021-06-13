import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('BiWeeklyDisburseLog', { schema: 'dbo' })
export class BiWeeklyDisburseLog {
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

	@Column('varchar', {
		length: 150,
		nullable: true,
		name: 'employer_id',
	})
	employer_id: string | null;

	@Column('datetime', {
		nullable: true,
		name: 'start_date',
	})
	start_date: Date;

	@Column('datetime', {
		nullable: true,
		name: 'end_date',
	})
	end_date: Date;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

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
}
