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
exports.CustomerDevice = void 0;
const typeorm_1 = require("typeorm");
const Customer_entity_1 = require("./Customer.entity");
const class_transformer_1 = require("class-transformer");
const typeorm_encrypted_1 = require("typeorm-encrypted");
const index_1 = require("../config/index");
let CustomerDevice = class CustomerDevice {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], CustomerDevice.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], CustomerDevice.prototype, "idx", void 0);
__decorate([
    typeorm_1.OneToOne(() => Customer_entity_1.Customer, customer => customer.id, {}),
    typeorm_1.JoinColumn({ name: 'customer_id' }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], CustomerDevice.prototype, "customer_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'phone_brand',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "phone_brand", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'phone_os',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "phone_os", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'os_version',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "os_version", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'deviceid',
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "deviceid", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'fcm_token',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "fcm_token", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'otp',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "otp", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'token',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "token", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'otp_type',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "otp_type", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'otp_status',
    }),
    __metadata("design:type", Boolean)
], CustomerDevice.prototype, "otp_status", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        nullable: true,
        default: () => '0',
        name: 'total_attempt',
    }),
    __metadata("design:type", String)
], CustomerDevice.prototype, "total_attempt", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        name: 'otp_created_at',
    }),
    __metadata("design:type", Date)
], CustomerDevice.prototype, "otp_created_at", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], CustomerDevice.prototype, "created_on", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], CustomerDevice.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], CustomerDevice.prototype, "modified_on", void 0);
CustomerDevice = __decorate([
    typeorm_1.Entity('CustomerDevice', { schema: 'dbo' }),
    typeorm_1.Index(['idx'], { unique: true })
], CustomerDevice);
exports.CustomerDevice = CustomerDevice;
//# sourceMappingURL=CustomerDevice.entity.js.map