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
exports.EmployeePlaidInfo = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const Customer_entity_1 = require("./Customer.entity");
const typeorm_encrypted_1 = require("typeorm-encrypted");
const index_1 = require("../config/index");
let EmployeePlaidInfo = class EmployeePlaidInfo extends typeorm_1.BaseEntity {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], EmployeePlaidInfo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', { name: 'idx' }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_on',
        nullable: false,
        default: () => 'getdate()',
    }),
    __metadata("design:type", Date)
], EmployeePlaidInfo.prototype, "created_on", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], EmployeePlaidInfo.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], EmployeePlaidInfo.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], EmployeePlaidInfo.prototype, "is_obsolete", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_entity_1.Customer, customer => customer.plaid_infos, {
        eager: false,
    }),
    __metadata("design:type", Customer_entity_1.Customer)
], EmployeePlaidInfo.prototype, "customer", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'bank_name', length: 250, nullable: true }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "bank_name", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'access_token', length: 2000 }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "access_token", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'item_id', length: 2000 }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "item_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        name: 'account',
        length: 2000,
        nullable: true,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "account", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        name: 'account_id',
        length: 2000,
        nullable: true,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "account_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        name: 'routing',
        length: 2000,
        nullable: true,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "routing", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        name: 'wire_routing',
        length: 2000,
        nullable: true,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeePlaidInfo.prototype, "wire_routing", void 0);
EmployeePlaidInfo = __decorate([
    typeorm_1.Index(['idx'], { unique: true }),
    typeorm_1.Entity('EmployeePlaidInfo', { schema: 'dbo' })
], EmployeePlaidInfo);
exports.EmployeePlaidInfo = EmployeePlaidInfo;
//# sourceMappingURL=EmployeePlaidInfo.entity.js.map