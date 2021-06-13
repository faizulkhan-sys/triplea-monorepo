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
exports.EmployeeCardInfoEntity = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const Customer_entity_1 = require("./Customer.entity");
const config_1 = require("../config");
const typeorm_encrypted_1 = require("typeorm-encrypted");
let EmployeeCardInfoEntity = class EmployeeCardInfoEntity extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer', name: 'id' }),
    __metadata("design:type", Number)
], EmployeeCardInfoEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', { name: 'idx' }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], EmployeeCardInfoEntity.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_on',
        nullable: false,
        default: () => 'getdate()',
    }),
    __metadata("design:type", Date)
], EmployeeCardInfoEntity.prototype, "created_on", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], EmployeeCardInfoEntity.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_entity_1.Customer, customer => customer.plaid_infos, {
        eager: false,
    }),
    __metadata("design:type", Customer_entity_1.Customer)
], EmployeeCardInfoEntity.prototype, "customer", void 0);
__decorate([
    class_transformer_1.Transform(({ value }) => value.slice(value.length - 5), {
        toPlainOnly: true,
    }),
    typeorm_1.Column('varchar', {
        length: 1000,
        name: 'card_number',
        nullable: false,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: config_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeeCardInfoEntity.prototype, "card_number", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: false,
        name: 'expiry_date',
    }),
    __metadata("design:type", Date)
], EmployeeCardInfoEntity.prototype, "expiry_date", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'cvv',
        nullable: true,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: config_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeeCardInfoEntity.prototype, "cvv", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'pin',
        nullable: true,
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: config_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], EmployeeCardInfoEntity.prototype, "pin", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'type', length: 200 }),
    __metadata("design:type", String)
], EmployeeCardInfoEntity.prototype, "type", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'tabapay_account_id', length: 200 }),
    __metadata("design:type", String)
], EmployeeCardInfoEntity.prototype, "tabapay_account_id", void 0);
EmployeeCardInfoEntity = __decorate([
    typeorm_1.Index(['idx'], { unique: true }),
    typeorm_1.Entity('EmployeeCardInfo', {})
], EmployeeCardInfoEntity);
exports.EmployeeCardInfoEntity = EmployeeCardInfoEntity;
//# sourceMappingURL=EmployeeCardInfo.entity.js.map