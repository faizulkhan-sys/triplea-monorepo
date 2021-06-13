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
exports.EmployeeLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class EmployeeLoginDto {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Login type , 0 for password login , 1 for facebook and 2 for gmail',
        example: 0,
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsIn([0, 1, 2], { message: 'Login type can only be 0,1,2' }),
    __metadata("design:type", Number)
], EmployeeLoginDto.prototype, "login_type", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Username or email, case 0',
        example: 'orbis@gmail.com',
    }),
    class_validator_1.ValidateIf((o, _) => o.login_type === 0),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail({}, { message: 'Email must be a valid email' }),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    __metadata("design:type", String)
], EmployeeLoginDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Password, case 0',
        example: 'test@1234',
    }),
    swagger_1.ApiProperty(),
    class_validator_1.ValidateIf((o, _) => o.login_type === 0),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], EmployeeLoginDto.prototype, "password", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({
        description: 'Login id , which is either facebook or gmail id, case 1 or 2',
        example: '1234',
    }),
    class_validator_1.ValidateIf((o, _) => o.login_type === 1 || o.login_type === 2),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], EmployeeLoginDto.prototype, "login_id", void 0);
exports.EmployeeLoginDto = EmployeeLoginDto;
//# sourceMappingURL=employeeLogin.dto.js.map