import { JwtAuthGuard } from '@common/JwtGuard';
import { SetPassword } from '@dtos/SetPassword.dto';
import { EmployerLoginDto } from '@dtos/employerLogin.dto';
import { ChangeUserPass } from '@dtos/ChangeUserPass.dto';
import {IResponse} from '@common/interfaces/response.interface';
import {CheckAccessToken} from '@common/interfaces/acessTokenResponse.interface';
import { EmployerAuthService } from '@modules/employer-auth/employer-auth.service';
import {
	Body,
	//CacheInterceptor,
	//CacheTTL,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
	HttpService,
	Put,
	ClassSerializerInterceptor,
	HttpException,
	HttpStatus,
	Query,
	Headers
} from '@nestjs/common';
import {
	ForgotPassword,
	ResetPassword,
} from '@dtos/Derived.dto';
import { GetCAPTCHACode } from '@utils/captcha';
import { GetUser } from '@common/GetUser.decorator';
import { Users } from '@entities/Users';
import { Request } from 'express';
import { UserLoginDto } from '@dtos/Derived.dto';
import { catchError, map } from 'rxjs/operators';
import { BlockUnblock } from '@dtos/BlockUnblock.dto';
import { handleError } from '@utils/helpers';
import * as https from 'https';
import { ApiOperation, ApiTags, ApiBody, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiQuery, ApiParam, ApiCreatedResponse } from '@nestjs/swagger';
import validator from 'validator';
import { Permission } from '@entities/Permission';
import { Protocol } from '@entities/Protocol';
import { ProtocolUpdateDto } from '@dtos/protocol.dto';
import { AddUpdatesettings } from '@dtos/create-setting.dto';


@Controller('employer-auth')
export class EmployerAuthController {
  constructor(private readonly authMasterService: EmployerAuthService,
				private readonly httpService: HttpService) {}

	/**
	 *
	 * Logs in user . The user login has 4 types
	 *
	 * 0. For username / password with captcha
	 * 1. For social login using with facebook
	 * 2. For social login using with gmail
	 * 3. For username / password without captcha
	 *
	 * @param userLogin
	 * @param req
	 */

	 @Post('employer/login')
	 @ApiOperation({ description: 'Employer Login' })
	 @ApiBody({type: EmployerLoginDto})
	 @ApiCreatedResponse({description:"Successfully signed in"})
	 @ApiUnauthorizedResponse({description:"Invalid credentials"})
	 public async loginEmployer(
		 @Body() employerLogin: EmployerLoginDto,
		 @Req() req: Request,
	 ): Promise<any> {
		 const ip =
			 req?.ip || req.connection?.remoteAddress || req.get('x-forwarded-for');
			
		 return await this.authMasterService.loginEmployer(employerLogin, ip);
	 }

	 /**
	 *
	 *
	 * @param {UserLoginDto} userLogin
	 * @param {Request} req
	 * @return {*}  {Promise<any>}
	 */
	@Post('user/login')
	@ApiOperation({ description: 'User Login' })
	@ApiBody({type: UserLoginDto})
	@ApiCreatedResponse({description:"Successfully signed in"})
	@ApiUnauthorizedResponse({description:"Invalid credentials"})
	public async loginUser(
		@Body() userLogin: UserLoginDto,
		@Req() req: Request,
	): Promise<any> {
		const ip =
			req?.ip || req.connection?.remoteAddress || req.get('x-forwarded-for');

		return await this.authMasterService.loginUser(userLogin, ip);
	}

	/**
	 *	Checks if a token in an email is valid or not
	 *
	 * @param {string} token
	 * @return {*}  {Promise<any>}
	 */
	 @Get('check-link/:token')
	 @ApiOperation({ description: 'Checks if a token in an email is valid or not' })
	 @ApiOkResponse({description:"Token is correct"})
	 public async checkLink(@Param('token') token: string): Promise<IResponse> {
		 return await this.authMasterService.checkLink(token);
	 }

	 /**
	 *	sets a user password after the user has accepted the confirmation link
	 *
	 * @param {SetPassword} passwordDto
	 * @return {*}  {Promise<IResponse>}
	 */
	@Post('set-password')
	@ApiOperation({ description: 'Set Password' })
	@ApiBody({type: SetPassword})
	@ApiOkResponse({description:"Password set"})
	public async SetPassword(
		@Body() passwordDto: SetPassword,
	): Promise<IResponse> {
		return await this.authMasterService.setPassword(passwordDto);
	}

	/**
	 *
	 * Used for checking all the permissions and routes a user is allowed to use
	 *
	 * @param {*} header
	 * @return {*}  {Promise<CheckAccessToken>}
	 */
	//  @Post()
	//  public async token(@Headers() header): Promise<CheckAccessToken> {
	// 	 return await this.authMasterService.checkAccessToken(header);
	//  }

	 /**
	 * used for getting captcha used in login
	 *
	 * @return {*}  {Promise<string>}
	 */

	//@UseInterceptors(CacheInterceptor)
	//@CacheTTL(2)
	@Get('captcha')
	@ApiOperation({description: 'Get captcha for login'})
	@ApiOkResponse({description:"Get a captcha"})
	public async getCaptcha(): Promise<string> {
		return GetCAPTCHACode();
	}

	/**
	 *  Used for mapping frontend elements along with permission
	 *
	 * @param userRequesting
	 *
	 */

	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({description: 'Used for mapping frontend elements along with permission'})
	 @ApiOkResponse({description:"Get Mapped routes"})
	 @Get('mapped-routes')
	 public async getMappedRoutes(
		 @GetUser() userRequesting: Users,
	 ): Promise<unknown[]> {
		 return await this.authMasterService.listAllAccessibleAlias(userRequesting);
	 }

	@Put('block-unblock/:userType/:idx')
	@ApiOperation({ description: 'Block unblock userType' })
	@ApiBody({type: BlockUnblock})
	@ApiOkResponse({description:"Block/unblock userType"})
	BlockUnblockUser(
		@Param('idx') idx: string,
		@Param('userType') userType: string,
		@Body() blockUnblock: BlockUnblock,
		@Req() req: Request,
	) {
		let rootUrl: string = process.env.CUSTOMER_SERVICE_BLOCKUNBLOCK;

		if (userType === 'merchant') {
			rootUrl = process.env.MERCHANT_SERVICE_BLOCKUNBLOCK;
		}

		return this.httpService
			.put(
				rootUrl + idx,
				{ operation: blockUnblock.operation },
				{
					headers: { Authorization: req.headers.authorization },
					httpsAgent: new https.Agent({
						rejectUnauthorized: false,
					}),
				},
			)
			.pipe(
				map(response => response.data),
				catchError(handleError),
			);
	}

	@Put('reset-mpin/:userType/:idx')
	@ApiOperation({ description: 'Reset Mpin for userType' })
	@ApiOkResponse({description:"Mpin updated successfully"})
	ResetMpin(@Param('idx') idx: string, @Param('userType') userType: string) {
		let rootUrl: string = process.env.CUSTOMER_SERVICE_MPIN_RESET;

		if (userType === 'merchant') {
			rootUrl = process.env.MERCHANT_SERVICE_MPIN_RESET;
		}

		return this.httpService
			.put(rootUrl + idx, {
				httpsAgent: new https.Agent({
					rejectUnauthorized: false,
				}),
			})
			.pipe(
				map(response => response.data),
				catchError(handleError),
			);
	}

	/**
	 *
	 *
	 * @param {string} [permission_type]
	 * @return {*}  {Promise<Permission[]>}
	 */
	 @ApiOperation({ description: 'Get all permission'})
	 @ApiOkResponse({description:"Get all permission"})
	 @ApiTags('Permission')
	 @UseInterceptors(ClassSerializerInterceptor)
	 @Get('all-permission')
	 public async getAllPermission(
		 @Query('permission_type') permission_type?: string,
	 ): Promise<Permission[]> {
		 return await this.authMasterService.getAllPermission(permission_type);
	 }
 
	

	 /**
	 *
	 * Get all available protocol
	 *
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Get all available protocol'})
	@ApiOkResponse({description:"Get all available protocol"})
	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async getMany(): Promise<Protocol[]> {
		return await this.authMasterService.getAllProtocol();
	}

	

	/**
	 *
	 *
	 * @param {string} idx
	 * @return {*}
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'Get settings'})
	 @ApiOkResponse({description:"Get settings"})
	 @Get('get-settings')
	 async findOne(@GetUser() userRequesting: Users) {
		 return await this.authMasterService.getSetting(userRequesting.idx);
	 }
 
	 /**
	  *
	  *
	  * @param {string} idx
	  * @param {AddUpdatesettings} AddUpdateSettingDto
	  * @return {*}
	  */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'Add/Update settings'})
	 @ApiBody({type: AddUpdatesettings})
	 @ApiOkResponse({description:"Setting updated"})
	 @Put('update-settings')
	 async update(
		 @GetUser() userRequesting: Users,
		 @Body() AddUpdateSettingDto: AddUpdatesettings,
	 ) {
		 return await this.authMasterService.addUpdateSettings(
			 AddUpdateSettingDto,
			 userRequesting.idx,
		 );
	 }

	 /**
	 *
	 *
	 * @param {ForgotPassword} forgotPassword
	 * @return {*}  {Promise<IResponse>}
	 */
	@Post('forgot-password')
	@ApiOperation({ description: 'Forgot password' })
	@ApiBody({type: ForgotPassword})
	@ApiOkResponse({description:"Email Send for code"})
	async forgotPassword(
		@Body() forgotPassword: ForgotPassword,
	): Promise<IResponse> {
		return await this.authMasterService.forgotPassword(forgotPassword);
	}

	/**
	 *
	 *
	 * @param {ResetPassword} resetPassword
	 * @return {*}  {Promise<IResponse>}
	 */
	 @Put('reset-password')
	 @ApiOperation({ description: 'Reset password' })
	 @ApiBody({type: ResetPassword})
	 @ApiOkResponse({description:"Password updated successfully"})
	 async resetPassword(@Body() resetPassword: ResetPassword): Promise<IResponse> {
		 return await this.authMasterService.resetPassword(resetPassword);
	 }

	 /**
	 * change user password
	 *
	 * @param passwords
	 * @param user
	 */

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'change password' })
	@ApiBody({type: ChangeUserPass})
	@ApiOkResponse({description:"User password changed"})
	@Post('change-password')
	async changeUserPassword(
		@Body() passwords: ChangeUserPass,
		@GetUser() user: Users,
	): Promise<IResponse> {
		const idx = user.idx;

		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return await this.authMasterService.changePassword(passwords, user.idx);
	}

	/**
	 *
	 * update a protocol
	 *
	 * @param idx
	 * @param protocolUpdate
	 */

	 @Put(':idx')
	 @ApiOperation({ description: 'update a protocol'})
	 @ApiBody({type: ProtocolUpdateDto})
	 @ApiOkResponse({description:"Protocol updated"})
	 @ApiUnauthorizedResponse({description:"Invalid idx"})
	 @ApiUnprocessableEntityResponse({description:"Bad idx value"})
	 @ApiNotFoundResponse({description:'User with given idx not found'})
	 async updateProtocol(
		 @Param('idx') idx: string,
		 @Body() protocolUpdate: ProtocolUpdateDto,
	 ): Promise<IResponse> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		 }
 
		 return await this.authMasterService.updateProtocol(idx, protocolUpdate);
	 }
	  /**
	  *
	  *
	  * @param {string} idx
	  * @return {*}  {Promise<Permission>}
	  */
	   @ApiOperation({ description: 'Get permission by idx' })
	   @ApiTags('Permission')
	   @ApiOkResponse({description:"Get a permissions"})
	   @ApiUnauthorizedResponse({description:"Invalid idx"})
	   @ApiUnprocessableEntityResponse({description:"Bad idx value"})
	   @ApiNotFoundResponse({description:'User with given idx not found'})
	   @Get(':idx')
	   public async getOnePermissionByIdx(@Param('idx') idx: string): Promise<Permission> {
		   if (!validator.isUUID(idx, 'all')) {
			   throw new HttpException('Bad idx value', HttpStatus.UNPROCESSABLE_ENTITY);
		   }
   
		   return await this.authMasterService.getPermissionByIdx(idx);
	   }
 }


