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
exports.CustomerCard = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const typeorm_encrypted_1 = require("typeorm-encrypted");
const index_1 = require("../config/index");
let CustomerCard = class CustomerCard {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], CustomerCard.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', { name: 'idx' }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], CustomerCard.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_on',
        nullable: false,
        default: () => 'getdate()',
    }),
    __metadata("design:type", Date)
], CustomerCard.prototype, "created_on", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], CustomerCard.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], CustomerCard.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], CustomerCard.prototype, "is_obsolete", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        name: 'customer_idx',
    }),
    __metadata("design:type", String)
], CustomerCard.prototype, "customer_idx", void 0);
__decorate([
    typeorm_1.Column('varchar', { name: 'membership_type', length: 16 }),
    __metadata("design:type", String)
], CustomerCard.prototype, "membership_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        name: 'membership_number',
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: index_1.default.db.key,
            algorithm: 'aes-256-cbc',
            ivLength: 16,
        }),
    }),
    __metadata("design:type", String)
], CustomerCard.prototype, "membership_number", void 0);
__decorate([
    typeorm_1.Column('date', { name: 'valid_till' }),
    __metadata("design:type", String)
], CustomerCard.prototype, "valid_till", void 0);
__decorate([
    typeorm_1.Column('integer', { name: 'reward_point' }),
    __metadata("design:type", Number)
], CustomerCard.prototype, "reward_point", void 0);
CustomerCard = __decorate([
    typeorm_1.Index(['membership_number', 'idx', 'customer_idx'], { unique: true }),
    typeorm_1.Entity('CustomerCard', { schema: 'dbo' })
], CustomerCard);
exports.CustomerCard = CustomerCard;
//# sourceMappingURL=CustomerCard.entity.js.map