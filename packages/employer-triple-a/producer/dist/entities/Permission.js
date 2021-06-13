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
exports.Permission = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const PermissionUserType_1 = require("./PermissionUserType");
let Permission = class Permission {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Permission.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'base_name',
    }),
    __metadata("design:type", String)
], Permission.prototype, "base_name", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'url',
    }),
    __metadata("design:type", String)
], Permission.prototype, "url", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'method',
    }),
    __metadata("design:type", String)
], Permission.prototype, "method", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], Permission.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 150,
        name: 'permission_type',
    }),
    __metadata("design:type", String)
], Permission.prototype, "permission_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'alias',
    }),
    __metadata("design:type", String)
], Permission.prototype, "alias", void 0);
__decorate([
    typeorm_1.OneToMany(() => PermissionUserType_1.PermissionUserType, permissionUserType => permissionUserType.permission),
    __metadata("design:type", Array)
], Permission.prototype, "permissionUserType", void 0);
__decorate([
    typeorm_1.OneToMany(() => PermissionUserType_1.PermissionUserType, permissionRoleTemp => permissionRoleTemp.permission),
    __metadata("design:type", Array)
], Permission.prototype, "permissionRoleTemps", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], Permission.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], Permission.prototype, "modified_on", void 0);
Permission = __decorate([
    typeorm_1.Entity('Permission', { schema: 'dbo' })
], Permission);
exports.Permission = Permission;
//# sourceMappingURL=Permission.js.map