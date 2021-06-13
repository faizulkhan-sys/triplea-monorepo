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
exports.Customer = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const typeorm_encrypted_1 = require("typeorm-encrypted");
const CustomerDevice_entity_1 = require("./CustomerDevice.entity");
const EmployeeCardInfo_entity_1 = require("./EmployeeCardInfo.entity");
const EmployeeDailyLogInfo_entity_1 = require("./EmployeeDailyLogInfo.entity");
const EmployeePlaidInfo_entity_1 = require("./EmployeePlaidInfo.entity");
const index_1 = require("../config/index");
let Customer = class Customer {
    getUrl() {
        this.full_name = `${this.first_name} ${this.middle_name} ${this.last_name}`;
        if (this.middle_name || this.middle_name !== ' ') {
            this.full_name = `${this.first_name} ${this.last_name}`;
        }
    }
};
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Customer.prototype, "getUrl", null);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'first_name' }),
    __metadata("design:type", String)
], Customer.prototype, "first_name", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'middle_name', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "middle_name", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'last_name' }),
    __metadata("design:type", String)
], Customer.prototype, "last_name", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', { length: 150, name: 'password', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'is_password_set',
        default: () => '(0)',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_password_set", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'email' }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'gender', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'phone_number',
        default: () => 'N/A',
    }),
    __metadata("design:type", String)
], Customer.prototype, "phone_number", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'phone_number_ext',
        nullable: true,
    }),
    __metadata("design:type", String)
], Customer.prototype, "phone_number_ext", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'zip_code' }),
    __metadata("design:type", String)
], Customer.prototype, "zip_code", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'hourly_rate' }),
    __metadata("design:type", String)
], Customer.prototype, "hourly_rate", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'pay_rate', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "pay_rate", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 200, name: 'fcm_key', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "fcm_key", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'platform', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "platform", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'google_id', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "google_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'fb_id', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "fb_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'employer_id' }),
    __metadata("design:type", String)
], Customer.prototype, "employer_id", void 0);
__decorate([
    class_transformer_1.Transform(({ value }) => value.slice(value.length - 5), {
        toPlainOnly: true,
    }),
    typeorm_1.Column('varchar', { length: 150, name: 'ssn_no', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "ssn_no", void 0);
__decorate([
    typeorm_1.Column('date', { name: 'date_of_birth', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "date_of_birth", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'worker_status_type',
        default: () => 'N/A',
    }),
    __metadata("design:type", String)
], Customer.prototype, "worker_status_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'worker_status_reason',
        default: () => 'N/A',
    }),
    __metadata("design:type", String)
], Customer.prototype, "worker_status_reason", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'is_bank_set',
        nullable: false,
        default: () => '(0)',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_bank_set", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_on',
        default: () => 'getdate()',
    }),
    __metadata("design:type", Date)
], Customer.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'is_active',
        nullable: true,
        default: () => '(1)',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'is_debitcard',
        nullable: true,
        default: () => '(0)',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_debitcard", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'mobile_number_ext',
        nullable: true,
    }),
    __metadata("design:type", String)
], Customer.prototype, "mobile_number_ext", void 0);
__decorate([
    typeorm_1.OneToMany(() => CustomerDevice_entity_1.CustomerDevice, customerDevice => customerDevice.customer_id, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Customer.prototype, "customerDevices", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'is_first_time_import',
        default: () => '(0)',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_first_time_import", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'is_mpin_set',
        default: () => '(0)',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_mpin_set", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 100,
        name: 'mpin',
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], Customer.prototype, "mpin", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_invited',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_invited", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_registered',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_registered", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'sa_approved',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "sa_approved", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        default: () => 'INACTIVE',
        name: 'sa_status',
    }),
    __metadata("design:type", String)
], Customer.prototype, "sa_status", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], Customer.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'employee_id' }),
    __metadata("design:type", String)
], Customer.prototype, "employee_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'worker_id', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "worker_id", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', { nullable: true, name: 'last_synced' }),
    __metadata("design:type", Date)
], Customer.prototype, "last_synced", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'worker_type', length: 255, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "worker_type", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'employment_type', length: 255, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "employment_type", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column({ name: 'sort_order', type: 'int', default: 3, nullable: false }),
    __metadata("design:type", Number)
], Customer.prototype, "sort_order", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        name: 'residential_address',
        length: 1000,
        nullable: true,
    }),
    __metadata("design:type", String)
], Customer.prototype, "residential_address", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'mobile_number', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "mobile_number", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'department', length: 250, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "department", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'salary_type', length: 2000, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "salary_type", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'pay_frequency', length: 2000, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "pay_frequency", void 0);
__decorate([
    typeorm_1.OneToMany(() => EmployeePlaidInfo_entity_1.EmployeePlaidInfo, plaid_info => plaid_info.customer, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Customer.prototype, "plaid_infos", void 0);
__decorate([
    typeorm_1.OneToMany(() => EmployeeCardInfo_entity_1.EmployeeCardInfoEntity, card_info => card_info.customer, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Customer.prototype, "card_infos", void 0);
__decorate([
    typeorm_1.OneToMany(() => EmployeeDailyLogInfo_entity_1.EmployeeDailyLogEntity, daily_log => daily_log.customer, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Customer.prototype, "daily_logs", void 0);
Customer = __decorate([
    typeorm_1.Index(['employee_id', 'email'], { unique: true }),
    typeorm_1.Entity('Customer', { schema: 'dbo' })
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=Customer.entity.js.map