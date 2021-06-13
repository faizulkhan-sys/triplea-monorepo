import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity('Criterias', { schema: 'dbo' })
export class Criterias {
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
		nullable: false,
		name: 'name',
	})
	name: string;

	@Column('varchar', {
		length: 150,
		nullable: false,
		name: 'type',
	})
	type: string;

	// parses all comma separated values in field to array

	@Transform(({ value }) => (value ? value.split(',') : null), {
		toPlainOnly: true,
	})
	@Column('varchar', {
		length: 1000,
		nullable: true,
		name: 'dropdown_items',
	})
	dropdown_items: string;

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
