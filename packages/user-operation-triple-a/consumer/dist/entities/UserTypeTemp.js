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
exports.UserTypeTemp = void 0;
const typeorm_1 = require("typeorm");
const PermissionUserTypeTemp_1 = require("./PermissionUserTypeTemp");
const class_transformer_1 = require("class-transformer");
const UserType_1 = require("./UserType");
let UserTypeTemp = class UserTypeTemp {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], UserTypeTemp.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        unique: true,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 100,
        name: 'description',
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "description", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], UserTypeTemp.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], UserTypeTemp.prototype, "is_active", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserType_1.UserType, userType => userType.user_type, {}),
    typeorm_1.JoinColumn({ name: 'usertype_id' }),
    __metadata("design:type", UserType_1.UserType)
], UserTypeTemp.prototype, "userType", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        name: 'user_type',
        length: 100,
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "user_type", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'created_by',
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "created_by", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 100,
        name: 'status',
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 100,
        name: 'alias',
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "alias", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 100,
        name: 'operation',
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "operation", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: true,
        length: 100,
        name: 'rejection_reason',
    }),
    __metadata("design:type", String)
], UserTypeTemp.prototype, "rejection_reason", void 0);
__decorate([
    typeorm_1.OneToMany(() => PermissionUserTypeTemp_1.PermissionUserTypeTemp, permissionUserTypeTemp => permissionUserTypeTemp.usertype),
    __metadata("design:type", Array)
], UserTypeTemp.prototype, "permissionUserTypeTemps", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], UserTypeTemp.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], UserTypeTemp.prototype, "modified_on", void 0);
UserTypeTemp = __decorate([
    typeorm_1.Entity('UserTypeTemp', { schema: 'dbo' }),
    typeorm_1.Index('UserTypeTemp_idx_key', ['idx'], { unique: true })
], UserTypeTemp);
exports.UserTypeTemp = UserTypeTemp;
//# sourceMappingURL=UserTypeTemp.js.map