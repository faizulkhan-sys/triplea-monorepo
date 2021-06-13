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
exports.UpdateUser = void 0;
const customOptional_1 = require("../common/customs/customOptional");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateUser {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Contact name of company',
        example: 'John Von Neuman',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(4, 100, {
        message: 'Contact name must be between 4 to 100 characters long',
    }),
    __metadata("design:type", String)
], UpdateUser.prototype, "contact_name", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Email of user',
        example: 'abc@xyz.com',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.IsEmail({}, { message: 'Email is invalid' }),
    class_validator_1.Length(10, 64, {
        message: 'Email must be between 10 to 64 characters long',
    }),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    __metadata("design:type", String)
], UpdateUser.prototype, "email", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Name of provider',
        example: 'abc corp',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.ValidateIf((o, _) => o.employer_no !== ''),
    class_validator_1.IsString({ message: 'Payroll system must be a string' }),
    class_validator_1.IsIn(['PAYCHEX', 'STANDALONE']),
    __metadata("design:type", String)
], UpdateUser.prototype, "payroll_system", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.ValidateIf((o, _) => o.employer_no !== ''),
    class_validator_1.IsString({ message: 'Time management system must be a string' }),
    __metadata("design:type", String)
], UpdateUser.prototype, "time_management_system", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.ValidateIf((o, _) => o.employer_no !== ''),
    class_validator_1.IsString({ message: 'Company internal HR must be a string' }),
    __metadata("design:type", String)
], UpdateUser.prototype, "company_internalhr_system", void 0);
__decorate([
    customOptional_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateUser.prototype, "employer_no", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'User type of user',
        example: 'fab74e6089390695fe29f591068abcbf10f5cc25',
    }),
    customOptional_1.IsOptional(),
    __metadata("design:type", Object)
], UpdateUser.prototype, "user_type", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Address of user',
        example: 'Abc Street',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.IsString({ message: 'Address must be string' }),
    class_validator_1.Length(5, 30, {
        message: 'Address must be between 5 to 30 characters long',
    }),
    __metadata("design:type", String)
], UpdateUser.prototype, "address", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Name of company',
        example: 'abc corp',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.IsString({ message: 'Company name must be a string' }),
    class_validator_1.Length(4, 100, {
        message: 'Company name must be between 4 to 100 characters long',
    }),
    __metadata("design:type", String)
], UpdateUser.prototype, "company_name", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Name of company',
        example: 'abc corp',
    }),
    customOptional_1.IsOptional(),
    class_validator_1.IsNumberString(),
    __metadata("design:type", String)
], UpdateUser.prototype, "zip_code", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Ext of phone number',
        example: '+977',
    }),
    customOptional_1.IsOptional(),
    __metadata("design:type", String)
], UpdateUser.prototype, "phone_ext", void 0);
exports.UpdateUser = UpdateUser;
//# sourceMappingURL=UpdateUser.dto.js.map