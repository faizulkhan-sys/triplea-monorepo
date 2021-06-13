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
exports.Operationrules = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
let Operationrules = class Operationrules {
};
__decorate([
    class_transformer_1.Exclude({ toPlainOnly: true }),
    typeorm_1.PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id',
    }),
    __metadata("design:type", Number)
], Operationrules.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'operation_type' }),
    __metadata("design:type", String)
], Operationrules.prototype, "operationType", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'period' }),
    __metadata("design:type", String)
], Operationrules.prototype, "period", void 0);
__decorate([
    typeorm_1.Column('varchar', { length: 150, name: 'period_unit' }),
    __metadata("design:type", String)
], Operationrules.prototype, "periodUnit", void 0);
__decorate([
    typeorm_1.Column('integer', { name: 'attempts' }),
    __metadata("design:type", Number)
], Operationrules.prototype, "attempts", void 0);
Operationrules = __decorate([
    typeorm_1.Entity('operationrules', { schema: 'dbo' })
], Operationrules);
exports.Operationrules = Operationrules;
//# sourceMappingURL=Operationrules.entity.js.map