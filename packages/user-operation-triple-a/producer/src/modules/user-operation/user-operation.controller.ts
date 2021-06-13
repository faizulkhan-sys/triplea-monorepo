import { JwtAuthGuard } from '@common/JwtGuard';
import {IResponse, Ipagination,response} from '@common/interfaces/response.interface';
import { WrongUserFound } from '@dtos/wronguser.dto';
import { UserOperationService } from '@modules/user-operation/user-operation.service';
import { ContactMe, InviteUserMobile } from '@dtos/Derived.dto';
import { NotifyDto } from '@dtos/Notify.dto';
import { ListActiveUserDto, ListPendingDto,ListActiveUserTypeDto } from '@dtos/ListQuery.dto';
import { UpdateUser } from '@dtos/UpdateUser.dto';
import { CreateUser } from '@dtos/CreateUser.dto';
import { EnableDisable } from '@dtos/EnableDisabledto';
import { ApproveRejectDto } from '@dtos/AppproverReject.dto';
import { FcmDto} from '@dtos/fcm.dto';
import { CreateUserType } from '@dtos/CreateUserType.dto';
import { UpdateUserTypeName } from '@dtos/UpdateUserTypeName.dto';
import { UpdateUserTypePermissions } from '@dtos/UpdateUserTypePermission.dto';

import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Delete,
	UseGuards,
	UseInterceptors,
	HttpService,
	Put,
	ClassSerializerInterceptor,
	HttpException,
	HttpStatus,
	Query
} from '@nestjs/common';
import { GetUser } from '@common/GetUser.decorator';
import { Users } from '@entities/Users';
import { IdEmployeeDto, CheckEmail, AddOrChangeNumber } from '@dtos/Derived.dto';
import { validateUUID } from '@utils/helpers';
import { ApiOperation, ApiTags, ApiBody, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import validator from 'validator';
import { Customer } from '@entities/Customer.entity';


@Controller('user-operation')
export class UserOperationController {
  constructor(private readonly userOpsService: UserOperationService,
				private readonly httpService: HttpService) {}

	/**
	 *
	 * Search Employer By name
	 * @param {string} query - Name of employer
	 * @returns
	 * @memberof UserOperationController
	 */
	 @Get('search-employer')
	 @ApiOperation({ description: 'Search employer' })
	 @ApiOkResponse({description:"Get Employer"})
	 @UseInterceptors(ClassSerializerInterceptor)
	 async getEmployerByName(@Query('query') query: string) {
		 if (query === '') {
			 return [];
		 }
 
		 return this.userOpsService.getEmployerByName(query);
	 }
	 
	 /**
	 * Search employer by state/zip
	 * for mobile to get company by state zip
	 *
	 * @param query
	 * @returns {Promise<{ data: { idx: string; contact_name: string; company_name: string; zip_code: string; }[];}> }
	 * @memberof UserOperationController
	 */

	@ApiOperation({ description: 'Search employer by state/zip' })
	@ApiOkResponse({description:"Get Employer"})
	@Get('get-employer')
	@UseInterceptors(ClassSerializerInterceptor)
	async getEmployerByZip(
		@Query('query') query: string,
	): Promise<{
		data: {
			idx: string;
			contact_name: string;
			company_name: string;
			zip_code: string;
		}[];
	}> {
		if (!query || query === '') {
			throw new HttpException('Query cannot be empty', HttpStatus.BAD_REQUEST);
		}

		return this.userOpsService.getEmployerByZip(query);
	}

	/**
	 *
	 * Sent Wrong User Info
	 * @param {WrongUserFound} wrongUser
	 * @returns {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @ApiOperation({ description: 'wrong user found' })
	 @ApiBody({type: WrongUserFound})
	 @ApiOkResponse({description:"Sent Wrong User Info"})
	 @Post('wrong-user-info')
	 @UseInterceptors(ClassSerializerInterceptor)
	 async wrongUserFound(@Body() wrongUser: WrongUserFound): Promise<IResponse> {
		 return this.userOpsService.wrongUserFound(wrongUser);
	 }

	 /**
	 *
	 * For mobile to get company by idx
	 * @param {string} idx
	 * @returns {Promise<Users>}
	 * @memberof UserOperationController
	 */
	@ApiOperation({ description: 'Get a user by idx' })
	@ApiOkResponse({description:"Get a user info"})
	@ApiUnauthorizedResponse({description:"Invalid idx"})
	@ApiUnprocessableEntityResponse({description:"Bad idx value"})
	@ApiNotFoundResponse({description:'User with given idx not found'})
	@UseInterceptors(ClassSerializerInterceptor)
	@Get('get-employer/:idx')
	async getEmployerByIdx(@Param('idx') idx: string): Promise<Users> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Bad idx value', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return this.userOpsService.getUserByIdx(idx);
	}

	/**
	 * Contact me for web
	 *
	 * @param {ContactMe} contactMe
	 * @returns {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @ApiOperation({ description: 'Contact me for web' })
	 @ApiBody({type: ContactMe})
	 @ApiOkResponse({description:"Sent a employer email"})
	 @ApiBadRequestResponse({description:'Invalid Email'})
	 @UseInterceptors(ClassSerializerInterceptor)
	 @Post('contactme')
	 async contactMe(@Body() contactMe: ContactMe): Promise<IResponse> {
		 return this.userOpsService.contactMe(contactMe.employer_email);
	 }

	 /**
	 *
	 * Invite a new employer from mobile
	 *
	 *
	 * @param {InviteUserMobile} userData
	 * @returns {Promise<IResponse>}
	 * @memberof UserOperationController
	 * 	 
	 */

	@ApiOperation({ description: 'Register a new employer from mobile' })
	@ApiBody({type: InviteUserMobile})
	@ApiOkResponse({description:"Register a new employer"})
	@ApiBadRequestResponse({description:'Invalid Email'})
	@Post('invite-employer')
	async invitemeployerMobile(
		@Body() userData: InviteUserMobile,
	): Promise<IResponse> {
		return this.userOpsService.inviteEmployerMobile(userData);
	}

	/**
	 *
	 * Notify an employee
	 * @param {NotifyDto} userData
	 * @returns {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @ApiOperation({ description: 'Notify an employee' })
	 @ApiBody({type: NotifyDto})
	 @ApiOkResponse({description:"Notify an employee"})
	 @ApiBadRequestResponse({description:'Invalid Email'})
	 @Put('notify-employee')
	 async setNotificationForEmployee(
		 @Body() userData: NotifyDto,
	 ): Promise<IResponse> {
		 return this.userOpsService.setNotification(userData);
	 }


	/**
	 *
	 * Get Pending List
	 * @param {ListPendingDto} listQuery
	 * @param {Users} userRequesting
	 * @return {*}  {Promise<Ipagination>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'Get Pending List' })
 	 @ApiQuery({type: ListPendingDto})
	 @ApiOkResponse({description:"Get pending list"})
	 @ApiUnprocessableEntityResponse({description:"Token malformed"})
	 @UseInterceptors(ClassSerializerInterceptor)
	 @Get('/pending')
	 async getAllPendingUsers(
		 @Query() listQuery: ListPendingDto,
		 @GetUser() userRequesting: Users,
	 ): Promise<Ipagination> {
		 return this.userOpsService.getAllPendingUsers(listQuery, userRequesting);
	 }


	/**
	 *
	 * Get single user by idx
	 *
	 * @param {string} idx
	 * @return {*}  {Promise<any>}
	 * @memberof UserOperationController
	 */
	@UseInterceptors(ClassSerializerInterceptor)
	@ApiOperation({ description: 'Get single pending user by idx' })
	@ApiOkResponse({description:"Get single pending user"})
	@ApiBadRequestResponse({description: 'Invalid idx'})
	@Get('pending/:idx')
	async GetPendingCustomerByIdx(@Param('idx') idx: string): Promise<any> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Invalid idx', HttpStatus.BAD_REQUEST);
		}

		return this.userOpsService.getAPendingUser(idx);
	}

	
 
	 /**
	  * Create a new user
	  *
	  * @param userData
	  * @param userRequesting
	  * @return {*}  {Promise<any>}
	  * @memberof UserOperationController
	  */
 
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiBody({type: CreateUser})
	 @ApiOperation({ description: 'Create a new user' })
	 @ApiOkResponse({description:"User created"})
	 @ApiUnprocessableEntityResponse({description:"Token malformed"})
	 @Post()
	 async createUser(
		 @Body() userData: CreateUser,
		 @GetUser() userRequesting: Users,
	 ): Promise<any> {
		 return this.userOpsService.createUser(userData, userRequesting);
	 }
 
	 /**
      * Delete user 
	  *
	  * @param idx
	  * @param userRequesting
	  * @returns {Promise<IResponse>}
	  * @memberof UserOperationController
	  */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()			
	 @ApiOperation({ description: 'Delete a user' })
	 @ApiOkResponse({description:"User Deleted"})
	 @ApiUnprocessableEntityResponse({description:"Token malformed"})
	 @Delete(':idx')
	 async deleteUser(
		 @Param('idx') idx: string,
		 @GetUser() userRequesting: Users,
	 ): Promise<IResponse> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		 }
 
		 return this.userOpsService.deleteUser(idx, userRequesting);
	 }

	 /**
	 * Verify User
	 *
	 * @param approveReject
	 * @param idx
	 * @param userRequesting
	 * @returns {Promise<IResponse>}
	 * @memberof UserOperationController
	 */

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Verify User' })
	@ApiTags('User')
	@ApiBody({type: ApproveRejectDto})
	@ApiOkResponse({description:"Verified User"})
	@ApiUnprocessableEntityResponse({description:"Token malformed"})
	@UseInterceptors(ClassSerializerInterceptor)
	@Put('verify/:idx')
	async changeUserStatus(
		@Body() approveReject: ApproveRejectDto,
		@Param('idx') idx: string,
		@GetUser() userRequesting: Users,
	): Promise<IResponse> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return this.userOpsService.verifyUserOperation(
			approveReject,
			idx,
			userRequesting,
		);
	}

	/**
	 *
	 * Block or unblock a user
	 *
	 * @param enableDisable
	 * @param idx
	 * @param userRequesting
	 * @returns {Promise<IResponse>}
	 * @memberof UserOperationController
	 */

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Enable/disable User' })
	@ApiBody({type: EnableDisable})
	@ApiOkResponse({description:"Block or unblock User"})
	@ApiUnprocessableEntityResponse({description:"Token malformed"})
	@ApiTags('User')
	@Put('enable-disable/:idx')
	async enableDisableUser(
		@Body() enableDisable: EnableDisable,
		@Param('idx') idx: string,
		@GetUser() userRequesting: Users,
	): Promise<IResponse> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return this.userOpsService.enableDisable(
			enableDisable.operation,
			idx,
			userRequesting,
		);
	}

	/**
	 *
	 *	Get Employee wage
	 * @param {Customer} employee
	 * @return {*}  {Promise<any>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOkResponse({description:"Get wage"})
	 @ApiUnprocessableEntityResponse({description:"Token malformed"})
	 @UseInterceptors(ClassSerializerInterceptor)
	 @Get('wage')
	 async calculateWage(@GetUser() employee: Customer): Promise<any> {
		 return this.userOpsService.calculateWage(
			 employee.idx,
			 employee.employer_id,
		 );
	 }

	 /**
	 *
	 * Get employee status
	 * @param {Customer} employee
	 * @return {*}  {Promise<{
	 * 		sa_status: string;
	 * 		is_bank_set: boolean;
	 * 		is_mobile_set: boolean;
	 * 		is_debitcard: boolean;
	 * 		mobile_number: boolean;
	 * 	}>}
	 * @memberof UserOperationController
	 */

	@ApiOperation({ description: 'Get employee status' })
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({description:"get employee status"})
	@ApiUnprocessableEntityResponse({description:"Token malformed"})
	@Get('employee-status')
	async employeeStatus(
		@GetUser() employee: Customer,
	): Promise<{
		sa_status: string;
		is_bank_set: boolean;
		is_mobile_set: boolean;
		is_debitcard: boolean;
		is_mpin_set: boolean;
		mobile_number: string;
	}> {
		return this.userOpsService.employeeStatus(employee.idx);
	}

	/**
	 *
	 *
	 * @param {Customer} employee
	 * @return {*}  {Promise<any>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiOperation({ description: 'get employee hours-worked' })
	 @ApiBearerAuth()
	 @ApiOkResponse({description:"Get employee hours-worked"})
	 @ApiUnprocessableEntityResponse({description:"Token malformed"})
	 @UseInterceptors(ClassSerializerInterceptor)
	 @Get('hours-worked')
	 async totalHoursWorked(@GetUser() employee: Customer): Promise<any> {
		 return this.userOpsService.hoursWorked(employee);
	 }

	 /**
	 *
	 * Second step in SignUp of Employee
	 * @param {IdEmployeeDto} idEmployee
	 * @return {*}  {Promise<{ statusCode: number; data: any }>}
	 * @memberof UserOperationController
	 */
	@ApiOperation({ description: 'Check id employee' })
	@ApiBody({type: IdEmployeeDto})
	@ApiOkResponse({description:"status of Id employee"})
	@ApiUnprocessableEntityResponse({description:"Token malformed"})
	@Post('id-employee')
	async idEmployee(
		@Body() idEmployee: IdEmployeeDto,
	): Promise<{ statusCode: number; data: any }> {
		return this.userOpsService.idEmployee(idEmployee);
	}

	/**
	 *
	 * First step in SignUp of Employee
	 * @param {CheckEmail} emailDto
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @ApiOperation({ description: 'check employee email' })
	 @ApiBody({type: CheckEmail})
	 @ApiOkResponse({description:"email status"})
	 @ApiBadRequestResponse({description:"Invalid email"})
	 @Post('check-email')
	 async checkEmail(@Body() emailDto: CheckEmail): Promise<IResponse> {
		 return this.userOpsService.checkEmail(emailDto);
	 }

	 /**
	 *
	 * Get employee by idx
	 * @param {string} idx
	 * @return {*}  {Promise<Customer>}
	 * @memberof UserOperationController
	 */
	@ApiOperation({ description: 'Get employee by idx' })
	@ApiOkResponse({description:"Get employee details"})
	@ApiUnauthorizedResponse({description:"Invalid idx"})
	@ApiUnprocessableEntityResponse({description:"Bad idx value"})
	@ApiNotFoundResponse({description:'User with given idx not found'})
	@Get('employee/:idx')
	async employeeMobile(@Param(':idx') idx: string): Promise<Customer> {
		validateUUID(idx);

		return this.userOpsService.getAllCustomerByIdx(idx);
	}

	/**
	 *
	 * Set fcm for an employee
	 * @param {Customer} employee
	 * @param {FcmDto} fcmDto
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'Set fcm for an employee' })
	 @ApiOkResponse({description:"Set the fcm for an employee"})
	 @ApiBody({type: FcmDto})
	 @Put('fcm')
	 async setFcm(
		 @GetUser() employee: Customer,
		 @Body() fcmDto: FcmDto,
	 ): Promise<IResponse> {
		 return this.userOpsService.setFcm(
			 employee.idx,
			 fcmDto.fcm_key,
			 fcmDto.platform,
		 );
	 }

	 /**
	 *
	 * Sent sa-active for employee
	 * @param {Customer} employee
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	@ApiOperation({ description: 'Sent sa-active' })
	@ApiOkResponse({description:"Set the fcm for an employee"})
	@ApiBody({type: FcmDto})
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@Put('sa-activate')
	async requestSaFeature(@GetUser() employee: Customer): Promise<IResponse> {
		return this.userOpsService.requestSaFeature(employee.idx);
	}

	/**
	 *
	 * Employee to add phone number
	 * @param {AddOrChangeNumber} addNumber
	 * @param {Customer} employee
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @ApiOperation({ description: 'Add phone number' })
	 @ApiOkResponse({description:"Phone number added"})
	 @ApiBody({type: AddOrChangeNumber})
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @Put('add-mobile')
	 async addMobileNumber(
		 @Body() addNumber: AddOrChangeNumber,
		 @GetUser() employee: Customer,
	 ): Promise<IResponse> {
		 console.log("***************employee from add mobile");
		 console.log(employee);
		 return this.userOpsService.addorChangeMobileNumber(
			 employee.idx,
			 addNumber,
			 'ADD_NUMBER',
		 );
	 }
 
	 /**
	  *
	  * Employee to change phone number
	  * @param {AddOrChangeNumber} changeNumber
	  * @param {Customer} employee
	  * @return {*}  {Promise<IResponse>}
	  * @memberof UserOperationController
	  */
	 @ApiOperation({ description: 'Change phone number' })
	 @ApiOkResponse({description:"Phone number changed"})
	 @ApiBody({type: AddOrChangeNumber})
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @Put('change-mobile')
	 async changeMobileNumber(
		 @Body() changeNumber: AddOrChangeNumber,
		 @GetUser() employee: Customer,
	 ): Promise<IResponse> {
		 return this.userOpsService.addorChangeMobileNumber(
			 employee.idx,
			 changeNumber,
			 'CHANGE_NUMBER',
		 );
	 }

	 /**
	 *
	 * Reset The user
	 * @param {Customer} employee
	 * @return {*}
	 * @memberof UserOperationController
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Reset the user' })
	@ApiOkResponse({description:"User reset"})
	@Put('reset-user')
	async resetUser(@GetUser() employee: Customer): Promise<IResponse> {
		return this.userOpsService.resetUser(employee);
	}

	// APIs related to userType starts

	/**
	 *
	 * Get all user type
	 * @param {number} [page=1]
	 * @param {number} [limit=10]
	 * @param {string} [search='']
	 * @return {*}  {Promise<Ipagination>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'Get all user type' })
	 @ApiOkResponse({description:"Get user type list"})
	 @ApiTags('UserType')
	 @UseInterceptors(ClassSerializerInterceptor)
	 @Get('usertype')
	 getAlluserType(
		 @Query() listUserType: ListActiveUserTypeDto,
	 ): Promise<Ipagination> {
		 return this.userOpsService.getAllUserType(listUserType);
	 }


	/**
	 *
	 * Get all pending user type
	 * @param {ListPendingDto} listPendingDto
	 * @param {Users} userRequesting
	 * @return {*}  {Promise<Ipagination>}
	 * @memberof UserOperationController
	 */
	 @UseInterceptors(ClassSerializerInterceptor)
	 @ApiOperation({ description: 'Get all pending user type' })
	 @ApiOkResponse({description:"Get pending user type list"})
	 @ApiTags('UserType')
	 @ApiQuery({type: ListPendingDto})
	 @Get('usertype/pending')
	 async GetAllPendingRoles(
		 @Query() listPendingDto: ListPendingDto,
		 @GetUser() userRequesting: Users,
	 ): Promise<Ipagination> {
		 return this.userOpsService.getAllPendingUserType(
			 listPendingDto,
			 userRequesting,
		 );
	}

	/**
	 *
	 * Get pending user type by idx
	 * @param {string} idx
	 * @return {*}  {Promise<any>}
	 * @memberof UserOperationController
	 */
	 @UseInterceptors(ClassSerializerInterceptor)
	 @ApiOperation({ description: 'Get pending user type' })
	 @ApiOkResponse({description:"Get pending user type info"})
	 @ApiTags('UserType')
	 @Get('usertype/pending/:idx')
	 async getPendingUserTypeByIdx(@Param('idx') idx: string): Promise<any> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Invalid idx', HttpStatus.BAD_REQUEST);
		 }
 
		 return this.userOpsService.getPendingUserTypeByIdx(idx);
	}

	/**
	 *
	 * Get User type by idx
	 * @param {string} idx
	 * @return {*}  {Promise<unknown>}
	 * @memberof UserOperationController
	 */
	
	 @ApiOperation({ description: 'Get User type by idx' })
	 @ApiOkResponse({description:"Get User type info"})
	 @Get('usertype/:idx')
	 @UseInterceptors(ClassSerializerInterceptor)
	 async getOneByIdx(@Param('idx') idx: string): Promise<unknown> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Bad idx value', HttpStatus.UNPROCESSABLE_ENTITY);
		 }
 
		 return this.userOpsService.getAUserType(idx);
	}

	/**
	 *
	 * Create user type
	 * @param {CreateUserType} dto
	 * @param {Users} userRequesting
	 * @return {*}
	 * @memberof UserOperationController
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Create user type' })
	@ApiOkResponse({description:"user type created"})
	@ApiUnauthorizedResponse({description:"Invalid idx"})
	@ApiUnprocessableEntityResponse({description:"Bad idx value"})
	@ApiTags('UserType')
	@ApiBody({type:CreateUser})
	@Post('usertype')
	async createUserType(
		@Body() dto: CreateUserType,
		@GetUser() userRequesting: Users,
	) {
		return this.userOpsService.createUsertype(dto, userRequesting);
	}

		/**
	 *
	 * Delete user type by idx
	 * @param {string} idx
	 * @param {Users} userRequesting
	 * @return {*}  {Promise<response>}
	 * @memberof UserOperationController
	 */
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Delete user type' })
	@ApiOkResponse({description:"user type deleted"})
	@ApiTags('UserType')
	@Delete('usertype/:idx')
	async deleteUserType(
		@Param('idx') idx: string,
		@GetUser() userRequesting: Users,
	): Promise<response> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		}
		return this.userOpsService.deleteUserType(idx, userRequesting);
	}


	/**
	 *
	 * Update usertype role name
	 * @param {UpdateUserTypeName} userType
	 * @param {string} idx
	 * @param {Users} userRequesting
	 * @return {*}  {Promise<response>}
	 * @memberof UserOperationController
	 */

	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'Update a Role Name' })
	 @ApiOkResponse({description:"Role Name updated"})
	 @ApiBody({type:UpdateUserTypeName})
	 @ApiTags('Role')
	 @Put('usertype/name/:idx')
	 async updateUserTypeName(
		 @Body() userType: UpdateUserTypeName,
		 @Param('idx') idx: string,
		 @GetUser() userRequesting: Users,
	 ): Promise<response> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		 }
		 return this.userOpsService.updateUserTypeName(
			 userType,
			 idx,
			 userRequesting,
		 );
	 }

	
			/**
	 * Verify a pending User
	 *
	 * @param approveReject
	 * @param idx
	 * @param userRequesting
	 */

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Verify UserType' })
	@ApiOkResponse({description:"user type Verified"})
	@ApiBody({type: ApproveRejectDto})
	@ApiTags('UserType')
	@UseInterceptors(ClassSerializerInterceptor)
	@Put('usertype/verify/:idx')
	async changeUserTypeStatus(
		@Body() approveReject: ApproveRejectDto,
		@Param('idx') idx: string,
		@GetUser() userRequesting: Users,
	): Promise<response> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		}
		return this.userOpsService.VerifyUserType(
			approveReject,
			idx,
			userRequesting,
		);
	}
	

	/**
	 *
	 * Update a user type role
	 * @param {UpdateUserTypePermissions} userType
	 * @param {string} idx
	 * @param {Users} userRequesting
	 * @return {*}  {Promise<response>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOkResponse({description:"Role updated"})
	 @ApiBody({type: UpdateUserTypePermissions})
	 @ApiOperation({ description: 'Update a Role' })
	 @ApiTags('Role')
	 @Put('usertype/permission/:idx')
	 async updateUserTypePermissions(
		 @Body() userType: UpdateUserTypePermissions,
		 @Param('idx') idx: string,
		 @GetUser() userRequesting: Users,
	 ): Promise<response> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		 }
 
		 return this.userOpsService.updateUserTypePermissions(
			 userType,
			 idx,
			 userRequesting,
		 );
	 }
	//APIs related to userType ends
	/**
	 *
	 * update a user attributes
	 *
	 * @param {UpdateUser} user
	 * @param {string} idx
	 * @param {Users} userRequesting
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationController
	 */
	 @UseGuards(JwtAuthGuard)
	 @ApiBearerAuth()
	 @ApiOperation({ description: 'update a user attributes' })
	 @ApiOkResponse({description:"User attribute updated"})
	 @ApiBody({type: UpdateUser})
	 @Put(':idx')
	 async updateUser(
		 @Body() user: UpdateUser,
		 @Param('idx') idx: string,
		 @GetUser() userRequesting: Users,
	 ): Promise<IResponse> {
		 if (!validator.isUUID(idx, 'all')) {
			 throw new HttpException('Invalid idx', HttpStatus.UNPROCESSABLE_ENTITY);
		 }
 
		 return this.userOpsService.updateUser(user, idx, userRequesting);
	 }
	/**
	 *
	 * Get All user Info
	 * @param {ListActiveUserDto} listQuery
	 * @return {*}  {Promise<Ipagination>}
	 * @memberof UserOperationController
	 */
	@ApiOperation({ description: ' all users' })
	@ApiOkResponse({description:"Get all user info"})
	@ApiQuery({type: ListActiveUserDto})
	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	async getAllUser(
		@Query() listQuery: ListActiveUserDto,
	): Promise<Ipagination> {
		return this.userOpsService.getAllUsers(listQuery);
	}


	 /**
	 *
	 * Get single user by idx
	 * @param {string} idx
	 * @return {*}  {Promise<Users>}
	 * @memberof UserOperationController
	 */
	@ApiOperation({ description: 'Get a user by idx' })
	@ApiOkResponse({description:"Get a user info"})
	@Get(':idx')
	@UseInterceptors(ClassSerializerInterceptor)
	async getUserByIdx(@Param('idx') idx: string): Promise<Users> {
		if (!validator.isUUID(idx, 'all')) {
			throw new HttpException('Bad idx value', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		return this.userOpsService.getUserByIdx(idx);
	}
 }


