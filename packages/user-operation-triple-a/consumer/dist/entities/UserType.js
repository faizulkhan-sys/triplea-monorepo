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
exports.UserType = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const PermissionUserType_1 = require("./PermissionUserType");
const Users_1 = require("./Users");
const UsersTemp_1 = require("./UsersTemp");
let UserType = class UserType {
    constructor(user_type, description) {
        this.user_type = user_type || '';
        this.description = description || '';
    }
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], UserType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], UserType.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        name: 'user_type',
    }),
    __metadata("design:type", String)
], UserType.prototype, "user_type", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        nullable: false,
        length: 150,
        name: 'description',
    }),
    __metadata("design:type", String)
], UserType.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToMany(() => PermissionUserType_1.PermissionUserType, permissionUserType => permissionUserType.userType),
    __metadata("design:type", Array)
], UserType.prototype, "permissionsUserType", void 0);
__decorate([
    typeorm_1.OneToMany(() => Users_1.Users, users => users.user_type),
    __metadata("design:type", Array)
], UserType.prototype, "users", void 0);
__decorate([
    typeorm_1.OneToMany(() => UsersTemp_1.UsersTemp, usersTemp => usersTemp.user_type),
    __metadata("design:type", Array)
], UserType.prototype, "usersTemps", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], UserType.prototype, "is_active", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], UserType.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], UserType.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], UserType.prototype, "created_on", void 0);
UserType = __decorate([
    typeorm_1.Entity('UserType', { schema: 'dbo' }),
    __metadata("design:paramtypes", [String, String])
], UserType);
exports.UserType = UserType;
//# sourceMappingURL=UserType.js.map