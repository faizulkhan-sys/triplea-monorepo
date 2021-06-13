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
exports.WrongUserLog = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
let WrongUserLog = class WrongUserLog {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], WrongUserLog.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], WrongUserLog.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 255,
        name: 'employer_id',
    }),
    __metadata("design:type", String)
], WrongUserLog.prototype, "employer_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 300,
        name: 'zip_code',
    }),
    __metadata("design:type", String)
], WrongUserLog.prototype, "zip_code", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 255,
        name: 'employee_id',
    }),
    __metadata("design:type", String)
], WrongUserLog.prototype, "employee_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 300,
        name: 'ssn_no',
    }),
    __metadata("design:type", String)
], WrongUserLog.prototype, "ssn_no", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 255,
        name: 'employee_email',
    }),
    __metadata("design:type", String)
], WrongUserLog.prototype, "employee_email", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 255,
        name: 'status',
    }),
    __metadata("design:type", String)
], WrongUserLog.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], WrongUserLog.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], WrongUserLog.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], WrongUserLog.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], WrongUserLog.prototype, "modified_on", void 0);
WrongUserLog = __decorate([
    typeorm_1.Entity('WrongUserLog', { schema: 'dbo' })
], WrongUserLog);
exports.WrongUserLog = WrongUserLog;
//# sourceMappingURL=WrongUserLog.js.map