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
exports.CreatePermission = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePermission {
}
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Base name of url',
        example: 'user',
    }),
    class_validator_1.IsNotEmpty({ message: 'Base Name is required' }),
    class_validator_1.IsString({ message: 'Base must be string' }),
    class_validator_1.Length(3, 30, {
        message: 'Base name must be between 3 to 30 characters long',
    }),
    __metadata("design:type", String)
], CreatePermission.prototype, "base_name", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Url',
        example: '/user',
    }),
    class_validator_1.IsNotEmpty({ message: 'Url is required' }),
    class_validator_1.IsString({ message: 'Url must be string' }),
    class_validator_1.IsUrl({}, { message: 'Url must be string' }),
    __metadata("design:type", String)
], CreatePermission.prototype, "url", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Method',
        example: 'POST',
    }),
    class_validator_1.IsNotEmpty({ message: 'Method is required' }),
    class_validator_1.IsString({ message: 'Method must be string' }),
    class_validator_1.IsIn(['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], {
        message: 'Value must be a valid method',
    }),
    __metadata("design:type", String)
], CreatePermission.prototype, "method", void 0);
exports.CreatePermission = CreatePermission;
//# sourceMappingURL=CreatePermission.dto.js.map