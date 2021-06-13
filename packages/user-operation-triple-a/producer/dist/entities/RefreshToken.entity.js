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
exports.RefreshTokens = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const Customer_entity_1 = require("./Customer.entity");
let RefreshTokens = class RefreshTokens extends typeorm_1.BaseEntity {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], RefreshTokens.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], RefreshTokens.prototype, "idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_entity_1.Customer),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Customer_entity_1.Customer)
], RefreshTokens.prototype, "user", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        name: 'expires_in',
    }),
    __metadata("design:type", Date)
], RefreshTokens.prototype, "expires_in", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_revoked',
    }),
    __metadata("design:type", Boolean)
], RefreshTokens.prototype, "is_revoked", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], RefreshTokens.prototype, "created_on", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], RefreshTokens.prototype, "modified_on", void 0);
RefreshTokens = __decorate([
    typeorm_1.Entity('EmployeeRefreshTokens', { schema: 'dbo' })
], RefreshTokens);
exports.RefreshTokens = RefreshTokens;
//# sourceMappingURL=RefreshToken.entity.js.map