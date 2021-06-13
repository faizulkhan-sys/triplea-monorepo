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
exports.Users = void 0;
const providers_enum_1 = require("../common/constants/providers.enum");
const UsersTemp_1 = require("./UsersTemp");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const CompanyUser_1 = require("./CompanyUser");
const UserType_1 = require("./UserType");
let Users = class Users {
    constructor(contact_name, email, zip_code, company_name, is_superadmin) {
        this.contact_name = contact_name || '';
        this.email = email || '';
        this.zip_code = zip_code || '';
        this.company_name = company_name || '';
        this.is_superadmin = is_superadmin || false;
    }
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Users.prototype, "idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserType_1.UserType, (UserType) => UserType.users, {
        nullable: true,
    }),
    typeorm_1.JoinColumn({ name: 'user_type' }),
    __metadata("design:type", UserType_1.UserType)
], Users.prototype, "user_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'username',
    }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'contact_name',
    }),
    __metadata("design:type", String)
], Users.prototype, "contact_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'time_management_system',
        nullable: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "time_management_system", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'company_internalhr_system',
        nullable: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "company_internalhr_system", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'payroll_system',
        nullable: true,
        default: () => providers_enum_1.AvailableProviders.STANDALONE,
    }),
    __metadata("design:type", String)
], Users.prototype, "payroll_system", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'password',
    }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'email',
    }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'address',
    }),
    __metadata("design:type", String)
], Users.prototype, "address", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 50,
        name: 'phone_number',
    }),
    __metadata("design:type", String)
], Users.prototype, "phone_number", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'company_id', nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "company_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'display_id', nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "display_id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 250, name: 'legal_name', nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "legal_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 50,
        name: 'employer_no',
    }),
    __metadata("design:type", String)
], Users.prototype, "employer_no", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 10,
        name: 'phone_ext',
    }),
    __metadata("design:type", String)
], Users.prototype, "phone_ext", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'company_name',
    }),
    __metadata("design:type", String)
], Users.prototype, "company_name", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'fb_id',
    }),
    __metadata("design:type", String)
], Users.prototype, "fb_id", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'google_id',
    }),
    __metadata("design:type", String)
], Users.prototype, "google_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'zip_code',
    }),
    __metadata("design:type", String)
], Users.prototype, "zip_code", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], Users.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_superadmin',
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "is_superadmin", void 0);
__decorate([
    typeorm_1.OneToMany(() => CompanyUser_1.CompanyUser, (CompanyUser) => CompanyUser.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "companyUsers", void 0);
__decorate([
    typeorm_1.OneToMany(() => UsersTemp_1.UsersTemp, usersTemp => usersTemp.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "usersTemps", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "is_obsolete", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'receive_questionare_form',
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "receive_questionare_form", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'receive_signed_agreement',
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "receive_signed_agreement", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], Users.prototype, "modified_on", void 0);
Users = __decorate([
    typeorm_1.Index(['employer_no', 'company_id', 'display_id'], { unique: true }),
    typeorm_1.Entity('Users', { schema: 'dbo' }),
    __metadata("design:paramtypes", [String, String, String, String, Boolean])
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map