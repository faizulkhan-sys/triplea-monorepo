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
exports.CustomerTemp = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
let CustomerTemp = class CustomerTemp {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], CustomerTemp.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], CustomerTemp.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'mobile_number_ext',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "mobile_number_ext", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'first_name',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "first_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'middle_name',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "middle_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'last_name',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "last_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'email',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "email", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        nullable: true,
        name: 'customer_id',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "customer_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'gender',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "gender", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'mobile_number',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "mobile_number", void 0);
__decorate([
    typeorm_1.Column('date', {
        nullable: true,
        name: 'date_of_birth',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "date_of_birth", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'zip_code', nullable: true }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "zip_code", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'hourly_rate', nullable: true }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "hourly_rate", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'ssn_no', nullable: true }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "ssn_no", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], CustomerTemp.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'status',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: true,
        name: 'created_by',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "created_by", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'operation',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "operation", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: true,
        name: 'rejection_reason',
    }),
    __metadata("design:type", String)
], CustomerTemp.prototype, "rejection_reason", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], CustomerTemp.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], CustomerTemp.prototype, "modified_on", void 0);
CustomerTemp = __decorate([
    typeorm_1.Entity('CustomerTemp', { schema: 'dbo' })
], CustomerTemp);
exports.CustomerTemp = CustomerTemp;
//# sourceMappingURL=customerTemp.entity.js.map