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
exports.RefreshRequest = exports.ChangePassword = exports.ExecuteFilter = exports.InviteEmployees = exports.SignUpEmployee = exports.ResetMpin = exports.ResetPassword = exports.OtpDto = exports.IdEmployeeDto = exports.ChangeMpin = exports.SetMpin = exports.ForgotPassword = exports.AddOrChangeNumber = exports.CheckEmail = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const AddFilter_1 = require("./AddFilter");
const Base_dto_1 = require("./Base.dto");
const swagger_2 = require("@nestjs/swagger");
class CheckEmail extends swagger_1.PickType(Base_dto_1.BaseDto, ['email']) {
}
exports.CheckEmail = CheckEmail;
class AddOrChangeNumber extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'mobile_number',
]) {
}
exports.AddOrChangeNumber = AddOrChangeNumber;
class ForgotPassword extends swagger_1.PickType(Base_dto_1.BaseDto, ['email']) {
}
exports.ForgotPassword = ForgotPassword;
class SetMpin extends swagger_1.PickType(Base_dto_1.BaseDto, ['mpin']) {
}
exports.SetMpin = SetMpin;
class ChangeMpin extends swagger_1.PickType(Base_dto_1.BaseDto, ['mpin']) {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: 'Mpin must not be empty' }),
    class_validator_1.Length(4, 4, { message: 'Mpin must be 4 digits' }),
    swagger_2.ApiProperty({
        description: 'New Mpin',
    }),
    class_validator_1.IsNumberString({ no_symbols: true }, { message: 'Mpin must be numeric string' }),
    __metadata("design:type", String)
], ChangeMpin.prototype, "new_mpin", void 0);
exports.ChangeMpin = ChangeMpin;
class IdEmployeeDto extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'employee_id',
    'employer_id',
    'ssn_no',
]) {
}
exports.IdEmployeeDto = IdEmployeeDto;
class OtpDto extends swagger_1.PickType(Base_dto_1.BaseDto, ['otp_code']) {
}
exports.OtpDto = OtpDto;
class ResetPassword extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'password',
    'otp_code',
]) {
}
exports.ResetPassword = ResetPassword;
class ResetMpin extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'mpin',
    'otp_code',
]) {
}
exports.ResetMpin = ResetMpin;
class SignUpEmployee extends swagger_1.PickType(Base_dto_1.BaseDto, [
    'email',
    'password',
    'idx',
]) {
}
exports.SignUpEmployee = SignUpEmployee;
class InviteEmployees extends swagger_1.PickType(Base_dto_1.BaseDto, ['idx']) {
}
exports.InviteEmployees = InviteEmployees;
class ExecuteFilter extends swagger_1.PickType(AddFilter_1.CreateFilterDto, [
    'criteria',
    'value',
]) {
}
exports.ExecuteFilter = ExecuteFilter;
class ChangePassword extends swagger_1.PickType(Base_dto_1.BaseDto, ['password']) {
}
__decorate([
    class_validator_1.IsNotEmpty({ message: 'New password cannot be empty' }),
    swagger_2.ApiProperty({
        description: 'New Password',
    }),
    class_validator_1.Length(8, 64, {
        message: 'New password must be between 8 to 64 characters long',
    }),
    __metadata("design:type", String)
], ChangePassword.prototype, "new_password", void 0);
exports.ChangePassword = ChangePassword;
class RefreshRequest {
}
__decorate([
    swagger_2.ApiProperty({
        description: 'Refresh Token',
    }),
    class_validator_1.IsNotEmpty({ message: 'The refresh token is required' }),
    __metadata("design:type", String)
], RefreshRequest.prototype, "refresh_token", void 0);
exports.RefreshRequest = RefreshRequest;
//# sourceMappingURL=Derived.dto.js.map