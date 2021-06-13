import { CreateFilterDto } from './AddFilter';
import { BaseDto } from './Base.dto';
declare const CheckEmail_base: import("@nestjs/common").Type<Pick<BaseDto, "email">>;
export declare class CheckEmail extends CheckEmail_base {
}
declare const AddOrChangeNumber_base: import("@nestjs/common").Type<Pick<BaseDto, "mobile_number">>;
export declare class AddOrChangeNumber extends AddOrChangeNumber_base {
}
declare const ForgotPassword_base: import("@nestjs/common").Type<Pick<BaseDto, "email">>;
export declare class ForgotPassword extends ForgotPassword_base {
}
declare const SetMpin_base: import("@nestjs/common").Type<Pick<BaseDto, "mpin">>;
export declare class SetMpin extends SetMpin_base {
}
declare const ChangeMpin_base: import("@nestjs/common").Type<Pick<BaseDto, "mpin">>;
export declare class ChangeMpin extends ChangeMpin_base {
    new_mpin: string;
}
declare const IdEmployeeDto_base: import("@nestjs/common").Type<Pick<BaseDto, "employer_id" | "ssn_no" | "employee_id">>;
export declare class IdEmployeeDto extends IdEmployeeDto_base {
}
declare const OtpDto_base: import("@nestjs/common").Type<Pick<BaseDto, "otp_code">>;
export declare class OtpDto extends OtpDto_base {
}
declare const ResetPassword_base: import("@nestjs/common").Type<Pick<BaseDto, "password" | "otp_code">>;
export declare class ResetPassword extends ResetPassword_base {
}
declare const ResetMpin_base: import("@nestjs/common").Type<Pick<BaseDto, "otp_code" | "mpin">>;
export declare class ResetMpin extends ResetMpin_base {
}
declare const SignUpEmployee_base: import("@nestjs/common").Type<Pick<BaseDto, "email" | "password" | "idx">>;
export declare class SignUpEmployee extends SignUpEmployee_base {
}
declare const InviteEmployees_base: import("@nestjs/common").Type<Pick<BaseDto, "idx">>;
export declare class InviteEmployees extends InviteEmployees_base {
}
declare const ExecuteFilter_base: import("@nestjs/common").Type<Pick<CreateFilterDto, "value" | "criteria">>;
export declare class ExecuteFilter extends ExecuteFilter_base {
}
declare const ChangePassword_base: import("@nestjs/common").Type<Pick<BaseDto, "password">>;
export declare class ChangePassword extends ChangePassword_base {
    new_password: string;
}
export declare class RefreshRequest {
    refresh_token: string;
}
export {};
