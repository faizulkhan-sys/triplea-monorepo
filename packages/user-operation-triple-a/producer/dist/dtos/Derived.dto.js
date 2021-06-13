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
exports.UserLoginDto = exports.ResetPassword = exports.ForgotPassword = exports.IdEmployeeDto = exports.AddOrChangeNumber = exports.CheckEmail = exports.ContactMe = exports.InviteUserMobile = exports.IdxArray = exports.ResetPasswordDto = void 0;
const Endswith_1 = require("../common/customs/Endswith");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Base_dto_1 = require("./Base.dto");
const employerLogin_dto_1 = require("./employerLogin.dto");
class ResetPasswordDto extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'password',
]) {
}
exports.ResetPasswordDto = ResetPasswordDto;
class IdxArray extends swagger_1.PickType(Base_dto_1.BaseDto, ['idx']) {
}
exports.IdxArray = IdxArray;
class InviteUserMobile extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'employee_email',
    'employer_email',
]) {
}
exports.InviteUserMobile = InviteUserMobile;
class ContactMe extends swagger_1.PickType(Base_dto_1.BaseDto, ['employer_email']) {
}
exports.ContactMe = ContactMe;
class CheckEmail extends swagger_1.PickType(Base_dto_1.BaseDto, ['email']) {
}
exports.CheckEmail = CheckEmail;
class AddOrChangeNumber extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'mobile_number',
]) {
}
exports.AddOrChangeNumber = AddOrChangeNumber;
class IdEmployeeDto extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'employee_id',
    'employer_id',
    'ssn_no',
]) {
}
exports.IdEmployeeDto = IdEmployeeDto;
class ForgotPassword extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'employer_email',
]) {
}
exports.ForgotPassword = ForgotPassword;
class ResetPassword extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'password',
    'otp_code',
]) {
}
exports.ResetPassword = ResetPassword;
class UserLoginDto extends swagger_1.PickType(employerLogin_dto_1.EmployerLoginDto, [
    'captcha_token',
    'captcha',
    'password',
]) {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail({}, { message: 'Email must be valid' }),
    class_transformer_1.Transform(({ value }) => value.toLowerCase(), { toClassOnly: true }),
    Endswith_1.EndsWith({ message: 'Email must end with orbispay.me' }),
    __metadata("design:type", String)
], UserLoginDto.prototype, "email", void 0);
exports.UserLoginDto = UserLoginDto;
//# sourceMappingURL=Derived.dto.js.map