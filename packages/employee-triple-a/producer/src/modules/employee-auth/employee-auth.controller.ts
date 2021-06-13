import { GetUser } from '@common/decorators/GetUser';
import { JwtAuthGuard } from '@common/guards/JwtGuard';
import { IResponse } from '@common/interfaces/response.interface';
import { EmployeeLoginDto } from '@dtos/employeeLogin.dto';
import { TokensService } from '@modules/token/tokens.service';
import { EmployeeAuthService } from './employee-auth.service';
import { Customer } from '@entities/Customer.entity';
import { ApiOperation, ApiTags, ApiBody, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiUnprocessableEntityResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { GetIdx } from '@common/decorators/GetIdx';
import { ListQueryDto } from '@dtos/ListQuery.dto';
import { CreateFilterDto } from '@dtos/AddFilter';
import { validateUUID } from '@utils/helpers';
import { ExecuteFilter } from '@dtos/Derived.dto';
import { UpdateFilterDto } from '@dtos/UpdateFilter';
import {
	ChangePassword,
	ForgotPassword,
	OtpDto,
	SetMpin as MpinDto,
	RefreshRequest,
	ResetPassword,
	SignUpEmployee,
	ChangeMpin,
	ResetMpin,
} from '@dtos/Derived.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Header,
  ClassSerializerInterceptor,
  UseInterceptors,
  Delete
} from '@nestjs/common';
import { ms } from 'date-fns/locale';

@Controller('employee-auth')
export class EmployeeAuthController {
  constructor(private readonly employeeAuthService: EmployeeAuthService,
    private readonly tokenService: TokensService,) {}

  @Post('login')
  @Header('content-type', 'application/json')
  @ApiOperation({ description: 'Employee Login' })
  @ApiBody({type: EmployeeLoginDto})
  @ApiCreatedResponse({description:"Successfully signed in"})
  @ApiUnauthorizedResponse({description:"Invalid credentials"})
  async login(
    @Body() emplLogin: EmployeeLoginDto,
  ): Promise<any> {
	const response = await this.employeeAuthService.loginEmployee(
		emplLogin
	  );
    return response;
  }

  /**
	 *
	 *
	 * @param {ResetMpin} resetMpinDto
	 * @returns {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Reset Mpin' })
	@ApiOkResponse({description:"Mpin updated successfully"})
	@ApiBody({type: ResetMpin})
	@Put('reset-mpin')
	async resetMpin(@Body() resetMpinDto: ResetMpin): Promise<IResponse> {
		return this.employeeAuthService.resetMpin(resetMpinDto);
	}
  
  /**
	 *
	 *
	 * @param {Customer} employee
	 * @returns {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Forgot Mpin' })
	@ApiOkResponse({description:"Email Send for code"})
	@Put('forgot-mpin')
	async forgetMpin(@GetUser() employee: Customer): Promise<IResponse> {
		return this.employeeAuthService.forgetMpin(employee);
	}

  /**
	 *
	 *
	 * @param {Customer} employee
	 * @param {MpinDto} mpinDto
	 * @returns {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Change Mpin' })
	@ApiOkResponse({description:"Mpin Changed successfully"})
	@ApiBody({type: ChangeMpin})
	@Put('change-mpin')
	async changeMpin(
		@GetUser() employee: Customer,
		@Body() mpinDto: ChangeMpin,
	): Promise<IResponse> {
		return this.employeeAuthService.changeMpin(employee, mpinDto);
	}

  /**
	 *
	 *
	 * @param {ChangePassword} changePassword
	 * @param {Customer} employee
	 * @return {*}  {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Change Password' })
	@ApiOkResponse({description:"Password Updated"})
	@ApiBody({type: ChangePassword})
	@Put('change-password')
	async changePassword(
		@Body() changePassword: ChangePassword,
		@GetUser() employee: Customer,
	): Promise<IResponse> {
		return this.employeeAuthService.changePassword(changePassword, employee);
	}

  /**
	 *
	 *
	 * @param {ResetPassword} resetPassword
	 * @return {*}  {Promise<IResponse>}
	 */
	@Put('reset-password')
	@ApiOperation({ description: 'Reset Password' })
	@ApiOkResponse({description:"Password updated successfully"})
	@ApiBody({type: ResetPassword})
	async resetPassword(
		@Body() resetPassword: ResetPassword,
	): Promise<IResponse> {
		return this.employeeAuthService.resetPassword(resetPassword);
	}

  /**
	 *
	 *
	 * @param {Customer} employee
	 * @param {MpinDto} mpinDto
	 * @returns {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Verify Mpin' })
	@ApiOkResponse({description:"Mpin verified"})
	@ApiBody({type: MpinDto})
	@Post('verify-mpin')
	async verifyMpin(
		@GetUser() employee: Customer,
		@Body() mpinDto: MpinDto,
	): Promise<IResponse> {
		return this.employeeAuthService.verifyMpin(employee, mpinDto);
	}

  /**
	 *
	 *
	 * @param {Customer} employee
	 * @param {MpinDto} mpinDto
	 * @returns {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Set Mpin' })
	@ApiOkResponse({description:"Mpin successfully set."})
	@ApiBody({type: MpinDto})
	@Put('mpin')
	async setMpin(
		@GetUser() employee: Customer,
		@Body() mpinDto: MpinDto,
	): Promise<IResponse> {
		return this.employeeAuthService.setMpin(employee, mpinDto);
	}

  /**
	 *
	 * @param {OtpDto} otp
	 * @return {*}  {Promise<IResponse>}
	 */
	@Post('verify-otp')
	@ApiOperation({ description: 'Verify OTP' })
	@ApiOkResponse({description:"OTP verified"})
	@ApiBody({type: OtpDto})
	async verifyOtp(@Body() otp: OtpDto): Promise<IResponse> {
		return this.employeeAuthService.verifyOtp(otp.otp_code);
	}

  /**
	 *
	 *
	 * @param {ForgotPassword} forgotPassword
	 * @return {*}  {Promise<IResponse>}
	 */
	@Post('forgot-password')
	@ApiOperation({ description: 'Forgot Password' })
	@ApiOkResponse({description:"Email Send for code"})
	@ApiBody({type: ForgotPassword})
	async forgotPassword(
		@Body() forgotPassword: ForgotPassword,
	): Promise<IResponse> {
		return this.employeeAuthService.forgotPassword(forgotPassword);
	}

  /**
	 *
	 *
	 * @param {RefreshRequest} body
	 * @return {*}  {Promise<any>}
	 */
   	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Token Refresh' })
	@ApiOkResponse({description:"Get a new access token"})
	@ApiBody({type: RefreshRequest})
	@Post('token/refresh')
	public async refresh(@Body() body: RefreshRequest): Promise<any> {
		const {
			token,
		} = await this.tokenService.createAccessTokenFromRefreshToken(
			body.refresh_token,
		);

		return {
			message: 'Operation Successful',
			access_token: token,
		};
	}

  /**
	 *
	 *
	 * @param {SignUpEmployee} signupDto
	 * @return {*}  {Promise<loginSignupReponse>}
	 */
	@ApiOperation({ description: 'signup employee' })
	@Post('signup')
	@ApiOperation({ description: 'Signup Employee' })
	@ApiOkResponse({description:"Employee signup successful"})
	@ApiBody({type: SignUpEmployee})
	async signUpEmployee(
		@Body() signupDto: SignUpEmployee,
	): Promise<any> {
		return this.employeeAuthService.signupEmployee(signupDto);
	}

  /**
	 *
	 *
	 * @param {Customer} employee
	 * @param {string} [refreshToken]
	 * @param {boolean} [fromAll=false]
	 * @return {*}  {Promise<IResponse>}
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Logout Employee' })
	@ApiOkResponse({description:"Employee logout successful"})
	@ApiBody({type: RefreshRequest})
	@Post('logout')
	async logout(
		@GetUser() employee: Customer,
		@Body() refreshToken?: RefreshRequest,
		@Query('from_all') fromAll = false,
	): Promise<IResponse> {
		if (fromAll) {
			return this.employeeAuthService.logoutFromAll(employee);
		} else {
			return this.employeeAuthService.logout(
				employee,
				refreshToken.refresh_token,
			);
		}
	}

  //Doubt
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Changed password' })
  @ApiOkResponse({description:"Change password done"})
  @Get('/changepwd/:idx')
	async chnage(@Param('idx') idx: string) : Promise<IResponse> {
		return this.employeeAuthService.changePasswordIdx(idx);
	}

	// /**
	//  *
	//  *
	//  * @param {string} idx
	//  * @param {ListQueryDto} listQuery
	//  * @return {*}  {Promise<any>}
	//  * @memberof FilterController
	// */
	// @UseGuards(JwtAuthGuard)
	// @UseInterceptors(ClassSerializerInterceptor)
	// @Get('filter')
	// async filters(
	// 		@GetIdx() idx: string,
	// 		@Query() listQuery: ListQueryDto,
	// 	): Promise<any> {
	// 		return this.employeeAuthService.getAllfilters(listQuery, idx);
	// }

	// 	/**
	//  *
	//  *
	//  * @param {CreateFilterDto} createDto
	//  * @param {string} idx
	//  * @return {*}
	//  * @memberof FilterController
	//  */
	// 	 @ApiOperation({ description: 'Create a new filter' })
	// 	 @UseGuards(JwtAuthGuard)
	// 	 @Post('filter')
	// 	 async createFilter(
	// 		 @Body() createDto: CreateFilterDto,
	// 		 @GetIdx() idx: string,
	// 	 ): Promise<IResponse> {
	// 		 return this.employeeAuthService.createFilter(createDto, idx);
	// 	 }

	// 	/**
	//  *
	//  *
	//  * @param {string} idx
	//  * @return {*}  {Promise<unknown>}
	//  * @memberof FilterController
	//  */
	// 	 @UseInterceptors(ClassSerializerInterceptor)
	// 	 @UseGuards(JwtAuthGuard)
	// 	 @Get('filter/:idx')
	// 	 async GetFilterByIdx(
	// 		 @Param('idx') idx: string,
	// 		 @GetIdx() employerIdx: string,
	// 	 ): Promise<unknown> {
	// 		 validateUUID(idx);
	 
	// 		 return this.employeeAuthService.getFilterByIdx(idx, employerIdx);
	// 	 }

	// /**
	//  *
	//  *
	//  * @param {UpdateFilterDto} updateDto
	//  * @param {string} idx
	//  * @return {*}
	//  * @memberof FilterController
	//  */
	//  @UseGuards(JwtAuthGuard)
	//  @Put('filter/:idx')
	//  async updateFilter(
	// 	 @Body() updateDto: UpdateFilterDto,
	// 	 @Param('idx') idx: string,
	// 	 @GetIdx() employerIdx: string,
	//  ): Promise<IResponse> {
	// 	 validateUUID(idx);
 
	// 	 return this.employeeAuthService.upateFilter(updateDto, idx, employerIdx);
	//  }
	
	// /**
	//  *
	//  *
	//  * @param {CreateFilterDto} createDto
	//  * @param {string} idx
	//  * @return {*}  {Promise<{ count: number }>}
	//  * @memberof FilterController
	//  */

	//  @UseGuards(JwtAuthGuard)
	//  @Post('filter/execute')
	//  async executeFilterOnce(
	// 	 @Body() createDto: ExecuteFilter,
	// 	 @GetIdx() idx: string,
	//  ): Promise<{ count: number }> {
	// 	 return this.employeeAuthService.executeFilterOnce(createDto, idx);
	//  }


	//  /**
	//  *
	//  *
	//  * @param {string} idx
	//  * @return {*}
	//  * @memberof FilterController
	//  */
	// @UseGuards(JwtAuthGuard)
	// @Delete('filter/:idx')
	// async deleteFilter(
	// 	@Param('idx') idx: string,
	// 	@GetIdx() employerIdx: string,
	// ): Promise<IResponse> {
	// 	validateUUID(idx);

	// 	return this.employeeAuthService.deleteFilter(idx, employerIdx);
	// }

	 
}
