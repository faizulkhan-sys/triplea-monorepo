"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaDeductionDetails = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
let SaDeductionDetails = class SaDeductionDetails {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', {
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'payroll_name',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "payroll_name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'company_name',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "company_name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'company_idx',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "company_idx", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'employee_type',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "employee_type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'employee_name',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "employee_name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'employee_idx',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "employee_idx", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'state',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: true,
        name: 'status',
    }),
    __metadata("design:type", Number)
], SaDeductionDetails.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'payroll_start_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "payroll_start_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'payroll_end_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "payroll_end_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'final_deduction_run_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "final_deduction_run_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'pre_deduction_run_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "pre_deduction_run_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'payroll_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "payroll_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        name: 'next_deduction_run_time',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "next_deduction_run_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'payroll_run_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "payroll_run_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'next_payroll_run_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "next_payroll_run_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'next_payroll_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "next_payroll_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'date',
        nullable: true,
        name: 'next_deduction_run_date',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "next_deduction_run_date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        name: 'final_deduction_run_time',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "final_deduction_run_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        name: 'pre_deduction_run_time',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "pre_deduction_run_time", void 0);
__decorate([
    typeorm_1.Column({
        type: 'int',
        nullable: true,
        name: 'cut_off_days',
    }),
    __metadata("design:type", Number)
], SaDeductionDetails.prototype, "cut_off_days", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'employer_display_id',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "employer_display_id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        length: 150,
        name: 'employee_worker_id',
    }),
    __metadata("design:type", String)
], SaDeductionDetails.prototype, "employee_worker_id", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        name: 'debit_pull',
    }),
    __metadata("design:type", Boolean)
], SaDeductionDetails.prototype, "debit_pull", void 0);
__decorate([
    typeorm_1.Column('decimal', {
        nullable: false,
        name: 'advance_owed',
    }),
    __metadata("design:type", Number)
], SaDeductionDetails.prototype, "advance_owed", void 0);
__decorate([
    typeorm_1.Column('decimal', {
        nullable: false,
        name: 'fee_extended',
    }),
    __metadata("design:type", Number)
], SaDeductionDetails.prototype, "fee_extended", void 0);
__decorate([
    typeorm_1.Column('decimal', {
        nullable: false,
        name: 'amount_extended',
    }),
    __metadata("design:type", Number)
], SaDeductionDetails.prototype, "amount_extended", void 0);
__decorate([
    typeorm_1.Column('decimal', {
        nullable: false,
        name: 'fee_owed',
    }),
    __metadata("design:type", Number)
], SaDeductionDetails.prototype, "fee_owed", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], SaDeductionDetails.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], SaDeductionDetails.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], SaDeductionDetails.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], SaDeductionDetails.prototype, "modified_on", void 0);
SaDeductionDetails = __decorate([
    typeorm_1.Entity('SaDeductionDetails', { schema: 'dbo' })
], SaDeductionDetails);
exports.SaDeductionDetails = SaDeductionDetails;
//# sourceMappingURL=SaDeductionDetails.entity.js.map