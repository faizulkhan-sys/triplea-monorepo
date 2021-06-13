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
exports.ActivityLog = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let ActivityLog = class ActivityLog {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], ActivityLog.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], ActivityLog.prototype, "idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users),
    typeorm_1.JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], ActivityLog.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'activity_type',
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "activity_type", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: true,
        name: 'login_status',
    }),
    __metadata("design:type", Boolean)
], ActivityLog.prototype, "login_status", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'login_type',
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "login_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'ip_address',
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ip_address", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'device_id',
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "device_id", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], ActivityLog.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], ActivityLog.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], ActivityLog.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], ActivityLog.prototype, "modified_on", void 0);
ActivityLog = __decorate([
    typeorm_1.Entity('ActivityLog_User', { schema: 'dbo' })
], ActivityLog);
exports.ActivityLog = ActivityLog;
//# sourceMappingURL=ActivityLog.js.map