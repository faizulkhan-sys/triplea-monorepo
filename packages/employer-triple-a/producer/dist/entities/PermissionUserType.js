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
exports.PermissionUserType = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const Permission_1 = require("./Permission");
const UserType_1 = require("./UserType");
let PermissionUserType = class PermissionUserType {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], PermissionUserType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], PermissionUserType.prototype, "idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserType_1.UserType, userType => userType.permissionsUserType, {
        nullable: false,
    }),
    typeorm_1.JoinColumn({ name: 'user_type' }),
    __metadata("design:type", UserType_1.UserType)
], PermissionUserType.prototype, "userType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Permission_1.Permission, permission => permission.permissionUserType, {
        nullable: false,
    }),
    typeorm_1.JoinColumn({ name: 'permission_id' }),
    __metadata("design:type", Permission_1.Permission)
], PermissionUserType.prototype, "permission", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], PermissionUserType.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], PermissionUserType.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'permission_base_name',
    }),
    __metadata("design:type", String)
], PermissionUserType.prototype, "base_name", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], PermissionUserType.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], PermissionUserType.prototype, "modified_on", void 0);
PermissionUserType = __decorate([
    typeorm_1.Entity('PermissionUserType', { schema: 'dbo' })
], PermissionUserType);
exports.PermissionUserType = PermissionUserType;
//# sourceMappingURL=PermissionUserType.js.map