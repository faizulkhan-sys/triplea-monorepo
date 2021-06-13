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
exports.Answers = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
let Answers = class Answers {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Answers.prototype, "id", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(0)',
        name: 'is_obsolete',
    }),
    __metadata("design:type", Boolean)
], Answers.prototype, "is_obsolete", void 0);
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.Column('datetime', {
        nullable: true,
        default: () => 'getdate()',
        name: 'modified_on',
    }),
    __metadata("design:type", Date)
], Answers.prototype, "modified_on", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Answers.prototype, "idx", void 0);
__decorate([
    typeorm_1.Column('bigint', {
        nullable: false,
        name: 'customer_id',
    }),
    __metadata("design:type", String)
], Answers.prototype, "customer_id", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'question',
    }),
    __metadata("design:type", Number)
], Answers.prototype, "question", void 0);
__decorate([
    typeorm_1.Column('varchar', {
        length: 150,
        nullable: false,
        name: 'answer',
    }),
    __metadata("design:type", String)
], Answers.prototype, "answer", void 0);
__decorate([
    typeorm_1.Column('bit', {
        nullable: false,
        default: () => '(1)',
        name: 'is_active',
    }),
    __metadata("design:type", Boolean)
], Answers.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column('datetime', {
        nullable: false,
        default: () => 'getdate()',
        name: 'created_on',
    }),
    __metadata("design:type", Date)
], Answers.prototype, "created_on", void 0);
Answers = __decorate([
    typeorm_1.Entity('Answers', { schema: 'dbo' }),
    typeorm_1.Index(['idx'], { unique: true })
], Answers);
exports.Answers = Answers;
//# sourceMappingURL=Answers.entity.js.map