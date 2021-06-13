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
exports.EmployerLoginDto = void 0;
const Endswith_1 = require("../common/customs/Endswith");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class EmployerLoginDto {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Email',
        example: 'orbis@gmail.com',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail({}, { message: 'Email must be valid' }),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    __metadata("design:type", String)
], EmployerLoginDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Password',
        example: 'test@1234',
    }),
    swagger_1.ApiProperty(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], EmployerLoginDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Captcha',
        example: 'tR3eYM',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsAlphanumeric('en-US', { message: 'Captcha can only be alphanumeric' }),
    __metadata("design:type", String)
], EmployerLoginDto.prototype, "captcha", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Captcha token',
        example: 'test@1234',
    }),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], EmployerLoginDto.prototype, "captcha_token", void 0);
exports.EmployerLoginDto = EmployerLoginDto;
//# sourceMappingURL=employerLogin.dto.js.map