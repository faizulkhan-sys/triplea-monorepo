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
exports.BaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class BaseDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsUUID('all', { each: true }),
    class_validator_1.ArrayMinSize(1, { message: 'Idx array requires at least one idx' }),
    __metadata("design:type", Array)
], BaseDto.prototype, "idx", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Emailof employer',
        example: 'test@gmail.com',
    }),
    class_validator_1.IsNotEmpty({ message: 'Email must not be empty' }),
    class_validator_1.Length(8, 64, {
        message: 'Employer Email must be between 8 to 64 characters long',
    }),
    class_validator_1.IsEmail({}, { message: 'Employer Email must be a valid email' }),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    __metadata("design:type", String)
], BaseDto.prototype, "employer_email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Emailof employee',
        example: 'test@gmail.com',
    }),
    class_validator_1.IsNotEmpty({ message: 'Email must not be empty' }),
    class_validator_1.Length(8, 64, {
        message: 'Employee Email must be between 8 to 64 characters long',
    }),
    class_validator_1.IsEmail({}, { message: 'Employee Email must be a valid email' }),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    __metadata("design:type", String)
], BaseDto.prototype, "employee_email", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'Otp code must not be empty' }),
    class_validator_1.Length(6, 6, { message: 'Otp code must be 6 digits' }),
    class_validator_1.IsNumberString({ no_symbols: true }, { message: 'Otp code must be numeric string' }),
    __metadata("design:type", String)
], BaseDto.prototype, "otp_code", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: ' Password to set',
        example: 'test@1234',
    }),
    class_validator_1.IsNotEmpty({ message: 'Password cannot be empty' }),
    class_validator_1.Length(8, 64, {
        message: 'Password must be between 8 to 64 characters long',
    }),
    __metadata("design:type", String)
], BaseDto.prototype, "password", void 0);
exports.BaseDto = BaseDto;
//# sourceMappingURL=Base.dto.js.map