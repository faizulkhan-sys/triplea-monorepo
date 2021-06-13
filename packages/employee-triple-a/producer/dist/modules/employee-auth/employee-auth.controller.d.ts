import { IResponse } from '@common/interfaces/response.interface';
import { EmployeeLoginDto } from '@dtos/employeeLogin.dto';
import { TokensService } from '@modules/token/tokens.service';
import { EmployeeAuthService } from './employee-auth.service';
import { Customer } from '@entities/Customer.entity';
import { ChangePassword, ForgotPassword, OtpDto, SetMpin as MpinDto, RefreshRequest, ResetPassword, SignUpEmployee, ChangeMpin, ResetMpin } from '@dtos/Derived.dto';
export declare class EmployeeAuthController {
    private readonly employeeAuthService;
    private readonly tokenService;
    constructor(employeeAuthService: EmployeeAuthService, tokenService: TokensService);
    login(emplLogin: EmployeeLoginDto): Promise<any>;
    resetMpin(resetMpinDto: ResetMpin): Promise<IResponse>;
    forgetMpin(employee: Customer): Promise<IResponse>;
    changeMpin(employee: Customer, mpinDto: ChangeMpin): Promise<IResponse>;
    changePassword(changePassword: ChangePassword, employee: Customer): Promise<IResponse>;
    resetPassword(resetPassword: ResetPassword): Promise<IResponse>;
    verifyMpin(employee: Customer, mpinDto: MpinDto): Promise<IResponse>;
    setMpin(employee: Customer, mpinDto: MpinDto): Promise<IResponse>;
    verifyOtp(otp: OtpDto): Promise<IResponse>;
    forgotPassword(forgotPassword: ForgotPassword): Promise<IResponse>;
    refresh(body: RefreshRequest): Promise<any>;
    signUpEmployee(signupDto: SignUpEmployee): Promise<any>;
    logout(employee: Customer, refreshToken?: RefreshRequest, fromAll?: boolean): Promise<IResponse>;
    chnage(idx: string): Promise<IResponse>;
}
