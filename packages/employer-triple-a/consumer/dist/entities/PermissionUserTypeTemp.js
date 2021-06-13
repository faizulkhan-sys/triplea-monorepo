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
exports.PermissionUserTypeTemp = void 0;
const typeorm_1 = require("typeorm");
const UserTypeTemp_1 = require("./UserTypeTemp");
const Permission_1 = require("./Permission");
const class_transformer_1 = require("class-transformer");
let PermissionUserTypeTemp = class PermissionUserTypeTemp {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], PermissionUserTypeTemp.prototype, "id", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], PermissionUserTypeTemp.prototype, "idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserTypeTemp_1.UserTypeTemp, userTypeTemp => userTypeTemp.permissionUserTypeTemps, {
        nullable: false,
    }),
    typeorm_1.JoinColumn({ name: 'usertype_id' }),
    __metadata("design:type", UserTypeTemp_1.UserTypeTemp)
], PermissionUserTypeTemp.prototype, "usertype", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Permission_1.Permission, permission => permission.permissionRoleTemps, {
        nullable: false,
    }),
    typeorm_1.JoinColumn({ name: 'permission_id' }),
    __metadata("design:type", Permission_1.Permission)
], PermissionUserTypeTemp.prototype, "permission", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], PermissionUserTypeTemp.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], PermissionUserTypeTemp.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 100,
        name: 'permission_base_name',
    }),
    __metadata("design:type", String)
], PermissionUserTypeTemp.prototype, "base_name", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], PermissionUserTypeTemp.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], PermissionUserTypeTemp.prototype, "modified_on", void 0);
PermissionUserTypeTemp = __decorate([
    typeorm_1.Entity('PermissionUserTypeTemp', { schema: 'dbo' })
], PermissionUserTypeTemp);
exports.PermissionUserTypeTemp = PermissionUserTypeTemp;
//# sourceMappingURL=PermissionUserTypeTemp.js.map