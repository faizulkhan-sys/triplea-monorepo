import { BaseDto } from './Base.dto';
import { EmployerLoginDto } from './employerLogin.dto';
declare const ResetPasswordDto_base: import("@nestjs/common").Type<Pick<BaseDto, "password">>;
export declare class ResetPasswordDto extends ResetPasswordDto_base {
}
declare const IdxArray_base: import("@nestjs/common").Type<Pick<BaseDto, "idx">>;
export declare class IdxArray extends IdxArray_base {
}
declare const InviteUserMobile_base: import("@nestjs/common").Type<Pick<BaseDto, "employer_email" | "employee_email">>;
export declare class InviteUserMobile extends InviteUserMobile_base {
}
declare const ContactMe_base: import("@nestjs/common").Type<Pick<BaseDto, "employer_email">>;
export declare class ContactMe extends ContactMe_base {
}
declare const ForgotPassword_base: import("@nestjs/common").Type<Pick<BaseDto, "employer_email">>;
export declare class ForgotPassword extends ForgotPassword_base {
}
declare const ResetPassword_base: import("@nestjs/common").Type<Pick<BaseDto, "otp_code" | "password">>;
export declare class ResetPassword extends ResetPassword_base {
}
declare const UserLoginDto_base: import("@nestjs/common").Type<Pick<EmployerLoginDto, "password" | "captcha" | "captcha_token">>;
export declare class UserLoginDto extends UserLoginDto_base {
    email?: string;
}
export {};
