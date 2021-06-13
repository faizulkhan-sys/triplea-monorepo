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
exports.EmailLog = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const Customer_entity_1 = require("./Customer.entity");
let EmailLog = class EmailLog {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], EmailLog.prototype, "id", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], EmailLog.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], EmailLog.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], EmailLog.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 255,
        name: 'email',
    }),
    __metadata("design:type", String)
], EmailLog.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 300,
        name: 'token',
    }),
    __metadata("design:type", String)
], EmailLog.prototype, "token", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_entity_1.Customer),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Customer_entity_1.Customer)
], EmailLog.prototype, "user", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], EmailLog.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], EmailLog.prototype, "is_active", void 0);
EmailLog = __decorate([
    typeorm_1.Entity('EmailLog', { schema: 'dbo' })
], EmailLog);
exports.EmailLog = EmailLog;
//# sourceMappingURL=EmailLog.entity.js.map