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
exports.EmployeeDailyLogEntity = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const Customer_entity_1 = require("./Customer.entity");
let EmployeeDailyLogEntity = class EmployeeDailyLogEntity extends typeorm_1.BaseEntity {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], EmployeeDailyLogEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', { name: 'idx' }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], EmployeeDailyLogEntity.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        name: 'created_on',
        nullable: false,
        default: () => 'getdate()',
    }),
    __metadata("design:type", Date)
], EmployeeDailyLogEntity.prototype, "created_on", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], EmployeeDailyLogEntity.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], EmployeeDailyLogEntity.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], EmployeeDailyLogEntity.prototype, "is_obsolete", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Customer_entity_1.Customer, customer => customer.plaid_infos, {
        eager: false,
    }),
    __metadata("design:type", Customer_entity_1.Customer)
], EmployeeDailyLogEntity.prototype, "customer", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('date', {
        nullable: false,
        default: () => 'getdate()',
        name: 'work_date',
    }),
    __metadata("design:type", Date)
], EmployeeDailyLogEntity.prototype, "work_date", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'hours_worked' }),
    __metadata("design:type", String)
], EmployeeDailyLogEntity.prototype, "hours_worked", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'earned_amount' }),
    __metadata("design:type", String)
], EmployeeDailyLogEntity.prototype, "earned_amount", void 0);
EmployeeDailyLogEntity = __decorate([
    typeorm_1.Index(['idx'], { unique: true }),
    typeorm_1.Entity('EmployeeDailyLog', { schema: 'dbo' })
], EmployeeDailyLogEntity);
exports.EmployeeDailyLogEntity = EmployeeDailyLogEntity;
//# sourceMappingURL=EmployeeDailyLogInfo.entity.js.map