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
exports.UsersTemp = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const UserType_1 = require("./UserType");
let UsersTemp = class UsersTemp {
    constructor(contact_name, email, zip_code, company_name, status, user) {
        this.contact_name = contact_name || '';
        this.email = email || '';
        this.zip_code = zip_code || '';
        this.company_name = company_name || '';
        this.status = status || 'PENDING';
        this.user = user || null;
    }
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], UsersTemp.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: true,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], UsersTemp.prototype, "idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserType_1.UserType, userType => userType.usersTemps, {}),
    typeorm_1.JoinColumn({ name: 'user_type' }),
    __metadata("design:type", UserType_1.UserType)
], UsersTemp.prototype, "user_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'username',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "username", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'contact_name',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "contact_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'employee_email',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "employee_email", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'password',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'time_management_system',
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "time_management_system", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'company_internalhr_system',
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "company_internalhr_system", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'payroll_system',
        nullable: true,
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "payroll_system", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'email',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "email", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'address',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "address", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'zip_code',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "zip_code", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 50,
        name: 'phone_number',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "phone_number", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 10,
        name: 'phone_ext',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "phone_ext", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'company_name',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "company_name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, users => users.usersTemps, {}),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", Users_1.Users)
], UsersTemp.prototype, "user", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_superadmin',
    }),
    __metadata("design:type", Boolean)
], UsersTemp.prototype, "is_superadmin", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'operation',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "operation", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'created_by',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "created_by", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'status',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'receive_questionare_form',
    }),
    __metadata("design:type", Boolean)
], UsersTemp.prototype, "receive_questionare_form", void 0);
__decorate([
    typeorm_1.Column('bit', {
        name: 'receive_signed_agreement',
    }),
    __metadata("design:type", Boolean)
], UsersTemp.prototype, "receive_signed_agreement", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'rejection_reason',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "rejection_reason", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], UsersTemp.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], UsersTemp.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], UsersTemp.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], UsersTemp.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'company_id', nullable: true }),
    __metadata("design:type", String)
], UsersTemp.prototype, "company_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'display_id', nullable: true }),
    __metadata("design:type", String)
], UsersTemp.prototype, "display_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 250, name: 'legal_name', nullable: true }),
    __metadata("design:type", String)
], UsersTemp.prototype, "legal_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 50,
        name: 'employer_no',
    }),
    __metadata("design:type", String)
], UsersTemp.prototype, "employer_no", void 0);
UsersTemp = __decorate([
    typeorm_1.Entity('UsersTemp', { schema: 'dbo' }),
    __metadata("design:paramtypes", [String, String, String, String, String, Users_1.Users])
], UsersTemp);
exports.UsersTemp = UsersTemp;
//# sourceMappingURL=UsersTemp.js.map