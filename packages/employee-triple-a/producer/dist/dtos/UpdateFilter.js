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
exports.UpdateFilterDto = void 0;
const customOptional_1 = require("../common/others/customOptional");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateFilterDto {
}
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(6, 64),
    swagger_1.ApiPropertyOptional({
        description: 'Name'
    }),
    class_validator_1.Matches(/^[-_ a-zA-Z0-9]+$/i, {
        message: 'Name must be alphanumeric',
    }),
    __metadata("design:type", String)
], UpdateFilterDto.prototype, "name", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsString(),
    swagger_1.ApiPropertyOptional({
        description: 'Value'
    }),
    __metadata("design:type", String)
], UpdateFilterDto.prototype, "value", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsUUID('all'),
    swagger_1.ApiPropertyOptional({
        description: 'Criteria'
    }),
    __metadata("design:type", Object)
], UpdateFilterDto.prototype, "criteria", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsBoolean(),
    swagger_1.ApiPropertyOptional({
        description: 'Is active'
    }),
    __metadata("design:type", Boolean)
], UpdateFilterDto.prototype, "is_active", void 0);
exports.UpdateFilterDto = UpdateFilterDto;
//# sourceMappingURL=UpdateFilter.js.map