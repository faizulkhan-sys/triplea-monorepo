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
exports.Operationlogs = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
let Operationlogs = class Operationlogs {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Operationlogs.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('uuid', { name: 'customer_idx' }),
    __metadata("design:type", String)
], Operationlogs.prototype, "customerIdx", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        name: 'token',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Operationlogs.prototype, "token", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'operation_type' }),
    __metadata("design:type", String)
], Operationlogs.prototype, "operationType", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'status', nullable: false }),
    __metadata("design:type", String)
], Operationlogs.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('uuid', {
        nullable: false,
        name: 'idx',
    }),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], Operationlogs.prototype, "idx", void 0);
Operationlogs = __decorate([
    typeorm_1.Index(['idx'], { unique: true }),
    typeorm_1.Entity('operationlogs', { schema: 'dbo' })
], Operationlogs);
exports.Operationlogs = Operationlogs;
//# sourceMappingURL=Operationlogs.entity.js.map