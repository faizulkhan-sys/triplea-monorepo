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
exports.Protocol = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
let Protocol = class Protocol {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Protocol.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Protocol.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('int', {
        nullable: false,
        name: 'login_attempt_interval',
    }),
    __metadata("design:type", Number)
], Protocol.prototype, "login_attempt_interval", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'login_interval_unit',
    }),
    __metadata("design:type", String)
], Protocol.prototype, "login_interval_unit", void 0);
__decorate([
    typeorm_1.Column('int', {
        nullable: false,
        name: 'login_max_retry',
    }),
    __metadata("design:type", Number)
], Protocol.prototype, "login_max_retry", void 0);
__decorate([
    typeorm_1.Column('int', {
        nullable: true,
        name: 'otp_expiry_in_minutes',
    }),
    __metadata("design:type", Number)
], Protocol.prototype, "otp_expiry_in_minutes", void 0);
__decorate([
    typeorm_1.Column('int', {
        nullable: true,
        name: 'mpin_attempt_interval',
    }),
    __metadata("design:type", Number)
], Protocol.prototype, "mpin_attempt_interval", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'mpin_interval_unit',
    }),
    __metadata("design:type", String)
], Protocol.prototype, "mpin_interval_unit", void 0);
__decorate([
    typeorm_1.Column('int', {
        nullable: true,
        name: 'mpin_max_retry',
    }),
    __metadata("design:type", Number)
], Protocol.prototype, "mpin_max_retry", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], Protocol.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], Protocol.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], Protocol.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], Protocol.prototype, "modified_on", void 0);
Protocol = __decorate([
    typeorm_1.Entity('Protocol_Employee', { schema: 'dbo' })
], Protocol);
exports.Protocol = Protocol;
//# sourceMappingURL=Protocol.entity.js.map