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
exports.CompanyUser = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let CompanyUser = class CompanyUser {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], CompanyUser.prototype, "id", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], CompanyUser.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], CompanyUser.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], CompanyUser.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: true,
        name: 'company_idx',
    }),
    __metadata("design:type", String)
], CompanyUser.prototype, "company_idx", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Users_1.Users, (Users) => Users.companyUsers, {}),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", Users_1.Users)
], CompanyUser.prototype, "user", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], CompanyUser.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], CompanyUser.prototype, "is_active", void 0);
CompanyUser = __decorate([
    typeorm_1.Entity('CompanyUser', { schema: 'dbo' })
], CompanyUser);
exports.CompanyUser = CompanyUser;
//# sourceMappingURL=CompanyUser.js.map