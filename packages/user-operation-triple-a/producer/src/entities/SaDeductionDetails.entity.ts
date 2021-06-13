import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('SaDeductionDetails', { schema: 'dbo' })
export class SaDeductionDetails {
	@PrimaryGeneratedColumn('uuid', {
		name: 'idx',
	})
	@Generated('uuid')
	idx: string | null;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'payroll_name',
	})
	payroll_name: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'company_name',
	})
	company_name: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'company_idx',
	})
	company_idx: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'employee_type',
	})
	employee_type: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'employee_name',
	})
	employee_name: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'employee_idx',
	})
	employee_idx: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'state',
	})
	state: string;

	@Column({
		type: 'int',
		nullable: true,
		name: 'status',
	})
	status: number;

	@Column({
		type: 'date',
		nullable: true,
		name: 'payroll_start_date',
	})
	payroll_start_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'payroll_end_date',
	})
	payroll_end_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'final_deduction_run_date',
	})
	final_deduction_run_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'pre_deduction_run_date',
	})
	pre_deduction_run_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'payroll_date',
	})
	payroll_date: string;

	@Column({
		type: 'varchar',
		nullable: true,
		name: 'next_deduction_run_time',
	})
	next_deduction_run_time: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'payroll_run_date',
	})
	payroll_run_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'next_payroll_run_date',
	})
	next_payroll_run_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'next_payroll_date',
	})
	next_payroll_date: string;

	@Column({
		type: 'date',
		nullable: true,
		name: 'next_deduction_run_date',
	})
	next_deduction_run_date: string;

	@Column({
		type: 'varchar',
		nullable: true,
		name: 'final_deduction_run_time',
	})
	final_deduction_run_time: string;

	@Column({
		type: 'varchar',
		nullable: true,
		name: 'pre_deduction_run_time',
	})
	pre_deduction_run_time: string;

	@Column({
		type: 'int',
		nullable: true,
		name: 'cut_off_days',
	})
	cut_off_days: number;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'employer_display_id',
	})
	employer_display_id: string;

	@Column({
		type: 'varchar',
		nullable: true,
		length: 150,
		name: 'employee_worker_id',
	})
	employee_worker_id: string;

	@Column('bit', {
		nullable: false,
		name: 'debit_pull',
	})
	debit_pull: boolean;

	@Column('decimal', {
		nullable: false,
		name: 'advance_owed',
	})
	advance_owed: number;

	@Column('decimal', {
		nullable: false,
		name: 'fee_extended',
	})
	fee_extended: number;

	@Column('decimal', {
		nullable: false,
		name: 'amount_extended',
	})
	amount_extended: number;

	@Column('decimal', {
		nullable: false,
		name: 'fee_owed',
	})
	fee_owed: number;

	@Column('datetime', {
		nullable: false,
		default: () => 'getdate()',
		name: 'created_on',
	})
	created_on: Date;

	@Column('bit', {
		nullable: false,
		default: () => '(0)',
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
