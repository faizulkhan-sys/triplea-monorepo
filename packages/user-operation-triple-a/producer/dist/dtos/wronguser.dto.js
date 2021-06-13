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
exports.WrongUserFound = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class WrongUserFound {
}
__decorate([
    swagger_1.ApiProperty({
        description: 'Emailof employee',
        example: 'test@gmail.com',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.Length(10, 64),
    class_validator_1.IsEmail({}),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    __metadata("design:type", String)
], WrongUserFound.prototype, "employee_email", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'Emailof employee',
        example: 'test@gmail.com',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumberString({ no_symbols: true }),
    class_validator_1.Length(4, 4, {
        message: 'SSN no must be exactly 4 digit in length',
    }),
    __metadata("design:type", String)
], WrongUserFound.prototype, "ssn_no", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'employee_id',
        example: 'test@gmail.com',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.Length(1, 5),
    __metadata("design:type", String)
], WrongUserFound.prototype, "employee_id", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'zip_code',
        example: '1234',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumberString({ no_symbols: true }),
    class_validator_1.Length(5, 5, {
        message: 'Zip code must be exactly 5 digit in length',
    }),
    __metadata("design:type", String)
], WrongUserFound.prototype, "zip_code", void 0);
__decorate([
    swagger_1.ApiProperty({
        description: 'employer_id',
        example: 'test@gmail.com',
    }),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsUUID('all'),
    __metadata("design:type", String)
], WrongUserFound.prototype, "employer_id", void 0);
exports.WrongUserFound = WrongUserFound;
//# sourceMappingURL=wronguser.dto.js.map