import { buildResponsePayload } from '@utils/helpers';
import { ServiceBusSenderService } from '@modules/service-bus-sender/service-bus-sender.service';
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { autoParseValues, fixedDecimal } from '@rubiin/js-utils';
import { subtractDate } from '@utils/helpers';
import { uniqueID, hashString,paginate,getHost} from '@utils/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@common/constants/status.enum';
import { Customer } from '@entities/Customer.entity';
import { Protocol } from '@entities/Protocol.entity';
import { Criterias } from '@entities/Criterias.entity';
import { ActivityLog } from '@entities/ActivityLog.entity';
import { Operations } from '@common/constants/operations.enum';
import { customAlphabet } from 'nanoid/async';
import { TokensService } from '@modules/token/tokens.service';
import {  Logger} from '@nestjs/common';
import { differenceInMinutes } from 'date-fns';
import {ChangeMpin,	ChangePassword,	ForgotPassword,	ResetMpin, ResetPassword, SetMpin, SignUpEmployee} from '@dtos/Derived.dto';
import { OtpLog } from '@entities/OtpLog.entity';
import {EmployeeLoginDto } from '@dtos/employeeLogin.dto';
import { IResponse } from '@common/interfaces/response.interface';
import * as argon from 'argon2';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ListQueryDto } from '@dtos/ListQuery.dto';
import * as config from '@config/index';
import { ServiceBusClient } from '@azure/service-bus';
import {endOfDay,startOfDay} from 'date-fns';
import {Repository,Between, getConnection,In ,getRepository,Brackets,Not} from 'typeorm';
import { SearchFilters } from '@entities/SearchFilters.entity';
import { CreateFilterDto } from '@dtos/AddFilter';
import { ExecuteFilter } from '@dtos/Derived.dto';
import { UpdateFilterDto } from '@dtos/UpdateFilter';
// Service Bus Connection String
const connectionString = config.default.sbSenderConnectionString;
// Max Retries
const maxRetries = config.default.sbSenderMaxRetries;
const REQUEST_APPROVE_SUCCESS_MSG = 'Request Approved Successfully';
const topicName = config.default.queueName;
const asyncTopicName = config.default.topicName;

@Injectable()
export class EmployeeAuthService {
	private readonly nanoid = customAlphabet('1234567890', 6);
  	constructor(
		@InjectRepository(Criterias)
		private readonly criteriaRepo: Repository<Criterias>,
		@InjectRepository(SearchFilters)
		private readonly searchFilterRepo: Repository<SearchFilters>,
    	@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
    	@InjectRepository(Protocol)
		private readonly protocolRepo: Repository<Protocol>,
		@InjectRepository(OtpLog)
		private readonly otpLogRepository: Repository<OtpLog>,
		@InjectRepository(ActivityLog)
		private readonly activityLogRepo: Repository<ActivityLog>,
    	private readonly serviceBusService: ServiceBusSenderService,
		private readonly tokenService: TokensService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   *
   * @param {EmployeeLoginDto} emplLogin- Employee login Dto
   * @return {Promise<any>} - Returns Promise of Object
   */
  async loginEmployee(
    emplLogin: EmployeeLoginDto
  ): Promise<any> {
	this.logger.log('Inside login Employee service', JSON.stringify(emplLogin));
    let scenario = 0;
    let user: Customer;
	emplLogin.password = unescape(emplLogin.password); //decoding the encoded special characters over http request
		switch (emplLogin.login_type) {
			case 0:
				user = await this.customerRepository.findOne({
					where: { email: emplLogin.email },
				});
				break;
			case 1:
				user = await this.customerRepository.findOne({
					where: {
						fb_id: emplLogin.login_id,
					},
				});
				break;

			case 2:
				user = await this.customerRepository.findOne({
					where: {
						google_id: emplLogin.login_id,
					},
				});
				break;
		}

		if (!user) {
			if (emplLogin.login_type === 0) {
				throw new UnauthorizedException('Invalid credentials');
			} else {
				return { statusCode: 200, message: JSON.stringify({ isRegistered: false }) };
			}
		}

		if (user.is_obsolete) {
			throw new BadRequestException('Invalid credentials');
		}

		if (!user.is_registered) {
			throw new HttpException(
				'Account not found for this email. Please create new account from the Login screen.',
				HttpStatus.FORBIDDEN,
			);
		}

		if (user && emplLogin.login_type === 0) {
			if (await argon.verify(user.password, emplLogin.password)) {
				if (!user.is_active) {
					throw new HttpException(
						'Account was locked due to multiple failed logins',
						HttpStatus.FORBIDDEN,
					);
				}

				//Reset Activity Log as this is success scenario
				const activityLogArray = await this.activityLogRepo.find({
					where: {
						user: user,
						is_obsolete: false,
						activity_type: 'LOGIN',
					},
					select: ['id', 'login_status', 'is_obsolete', 'created_on'],
					order: {
						created_on: "DESC",
					}
				});
				console.log('Activity Log Array LOGIN ATTEMPT TEST ********** ----> ' + JSON.stringify(activityLogArray));
				  let updateLog = [];
				  activityLogArray.every(elm => {
					  if (!elm.login_status) {
						updateLog.push(elm.id);
						return true;
					  } else {
						return false;
					  }
				});
				console.log('Activity log ids To make obsolete ****----> ' + JSON.stringify(updateLog))

				//Activity log ids To make obsolete
				if (updateLog.length > 0) {
					const serviceBusBodyDto = {
						is_obsolete: true ,
						id: updateLog,
					}
					const serviceBusDto = {
						serviceType: 'update-activity-log-employee-login',
						body: serviceBusBodyDto,
					};
			
					await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				}

				//Saving successfull login activity log
				const serviceBusBodyDto = {
					user: user,
				}
				const serviceBusDto = {
					serviceType: 'save-activity-log-employee-login',
					body: serviceBusBodyDto,
				};
				await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

				//Generate Access token For this success scenario
				const token = await this.tokenService.generateAccessToken(user);
				const refresh = await this.tokenService.generateRefreshToken(
					user,
					config.default.jwt.refresh_expiry,
				);
				const payload = buildResponsePayload(user, token, refresh);	
				console.log('API Login response : ' + JSON.stringify(payload));
				
				return ({
					message: 'Successfully signed in',
					data: payload,
				});
			} else {
				const protocolSettings = await this.protocolRepo.findOne({
					where: {
						is_active: true,
						is_obsolete: false,
					},
					select: [
						'login_attempt_interval',
						'login_interval_unit',
						'login_max_retry',
					],
				});
				
				const serviceBusBodyDto = {
					user: user,
				}
				const serviceBusDto = {
					serviceType: 'save-activity-log-false-employee-login',
					body: serviceBusBodyDto,
				};
		
				await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				
	
				const activityLog = await this.activityLogRepo.find({
					where: {
						created_on: Between(
							startOfDay(
								subtractDate(
									protocolSettings.login_interval_unit,
									protocolSettings.login_attempt_interval,
								),
							).toISOString(),
							endOfDay(new Date()).toISOString(),
						),
						login_status: false,
						status: false,
						user: user,
						is_obsolete: false,
						activity_type: 'LOGIN',
					},
				});
				if (activityLog.length >= protocolSettings.login_max_retry) {
					const serviceBusBodyDto = {
						is_active: false,
						id: user.id,
					}
					const serviceBusDto = {
						serviceType: 'update-employee-repo-login',
						body: serviceBusBodyDto,
					};
			
					await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
					throw new HttpException(
						'Account locked due to multiple incorrect logins',
						HttpStatus.FORBIDDEN,
					);
				}
				else{
					throw new UnauthorizedException(
						`Invalid credentials. You have  ${
							protocolSettings.login_max_retry - activityLog.length
						} attempts left before your account gets locked.`
					);
				}
			}
		}

		// facebook login and google login
		if (
			user &&
			(emplLogin.login_type === 1 || emplLogin.login_type === 2)
		) {
			const token = await this.tokenService.generateAccessToken(user);
			const refresh = await this.tokenService.generateRefreshToken(
				user,
				config.default.jwt.refresh_expiry,
			);
			const payload = buildResponsePayload(user, token, refresh);	
			console.log('API Login response : ' + JSON.stringify(payload));
			
			return ({
				message: 'Successfully signed in',
				data: payload,
			});
		}
  }

  async resetMpin(resetMpin: ResetMpin): Promise<IResponse> {
	const checkOtpExists = await this.otpLogRepository.findOne({
		where: {
			otp_code: resetMpin.otp_code,
			is_active: true,
		},
		relations: ['user'],
	});

	if (!checkOtpExists) {
		throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
	}

	const serviceBusBodyDto = {
		otp_code: resetMpin.otp_code,
		id: checkOtpExists.user.id,
		mpin: resetMpin.mpin
	}
	const serviceBusDto = {
		serviceType: 'reset-mpin-employee-auth',
		body: serviceBusBodyDto,
	};
  
	await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

	return { statusCode: 201, message: `Mpin updated successfully` };
  }

  async forgetMpin(employee: Customer): Promise<IResponse> {
	const checkCustomerWithEmail = await this.customerRepository.findOne({
		email: employee.email,
		is_active: true,
	});

	if (!checkCustomerWithEmail) {
		throw new HttpException(
			'Employee with email address not found',
			HttpStatus.NOT_FOUND,
		);
	}
	const otp_code = await this.nanoid();
	const otpLog = new OtpLog();

	otpLog.otp_code = otp_code;
	otpLog.user = employee;

	const serviceBusDto = {
		serviceType: 'forget-mpin-employee-auth',
		body: otpLog,
	};
  
	await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

	return { statusCode: 200, message: `Please check your email for code` };
  }

  async changeMpin(
	employee: Customer,
	mpinDto: ChangeMpin,
	): Promise<IResponse> {
	if (employee.mpin !== mpinDto.mpin) {
		throw new HttpException(
			'Current mpin is incorrect',
			HttpStatus.BAD_REQUEST,
		);
	}

	const serviceBusBodyDto = {
		idx: employee.idx,
		mpin: mpinDto.new_mpin,
	}
	const serviceBusDto = {
		serviceType: 'change-mpin-employee-auth',
		body: serviceBusBodyDto,
	};
  
	await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

	return { statusCode: 200, message: 'Operation successful' };
  }

  	/**
	 *
	 *
	 * @param {ChangePassword} changePassword
	 * @param {Customer} employee
	 * @return {*}  {Promise<IResponse>}
	 */
  async changePassword(
		changePassword: ChangePassword,
		employee: Customer,
	): Promise<IResponse> {
		changePassword.password = unescape(changePassword.password); //decoding the encoded special characters over http request
		changePassword.new_password = unescape(changePassword.new_password);
		if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(changePassword.new_password))) {
			console.log('Manual Check Failed ......-------------------->');
			throw new HttpException(
				'New password must contain at least 1 special character,uppercase letter, lowercase letter and number each',
				HttpStatus.BAD_REQUEST,
			);
		}
		if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(changePassword.password))) {
			console.log('Manual Check Failed ......-------------------->');
			throw new HttpException(
				'Current password is invalid',
				HttpStatus.BAD_REQUEST,
			);
		}
		const customer = await this.customerRepository.findOne({
			where: {
				idx: employee.idx,
				is_obsolete: false,
			},
		});

		if (!customer) {
			throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
		}

		//checking for password collisions

		if (changePassword.new_password === changePassword.password) {
			throw new HttpException(
				'Current password and new password cannot be same',
				HttpStatus.BAD_REQUEST,
			);
		}

		const isPasswordCorrect = await argon.verify(
			customer.password,
			changePassword.password,
		);
		if (!isPasswordCorrect) {
			throw new HttpException(
				'Current password does not match',
				HttpStatus.BAD_REQUEST,
			);
		}

		const hashedPwd = await hashString(changePassword.new_password);

		const serviceBusBodyDto = {
			idx: employee.idx,
			password: hashedPwd,
		}
		const serviceBusDto = {
			serviceType: 'change-password-employee-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

		return { statusCode: 200, message: 'Password Updated' };
  }

  async resetPassword(resetPassword: ResetPassword): Promise<IResponse> {
	const checkOtpExists = await this.otpLogRepository.findOne({
		where: {
			otp_code: resetPassword.otp_code,
			is_active: true,
		},
		relations: ['user'],
	});

	if (!checkOtpExists) {
		throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
	}

	resetPassword.password = unescape(resetPassword.password);
	if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(resetPassword.password))) {
		console.log('Manual Check Failed ......-------------------->');
		throw new HttpException(
			'New password must contain at least 1 special character,uppercase letter, lowercase letter and number each',
			HttpStatus.BAD_REQUEST,
		);
	}
	const pwdHash = await hashString(resetPassword.password);

	const serviceBusBodyDto = {
		otp_code: resetPassword.otp_code,
		id: checkOtpExists.user.id,
		password: pwdHash
	}
	const serviceBusDto = {
		serviceType: 'reset-password-employee-auth',
		body: serviceBusBodyDto,
	};

	await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

	return { statusCode: 201, message: `Password updated successfully` };
}

async verifyMpin(employee: Customer, mpinDto: SetMpin) {
	if (employee.mpin !== mpinDto.mpin) {
		const serviceBusBodyDto = {
			customer: employee,
			device: '',
			ip: '',
			login_type: 'MOBILE',
			activity_type: 'MPIN_VERIFY'
		}
		const serviceBusDto = {
			serviceType: 'verify-mpin-employee-auth',
			body: serviceBusBodyDto,
		};
	
		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

		const protocolSettings = await getConnection()
		.getRepository(Protocol)
		.findOne({
			where: {
				is_active: true,
				is_obsolete: false,
			},
			select: [
				'mpin_attempt_interval',
				'mpin_interval_unit',
				'mpin_max_retry',
			],
		});

		const activityLog = await getConnection()
			.getRepository(ActivityLog)
			.find({
				where: {
					created_on: Between(
						startOfDay(
							subtractDate(
								protocolSettings.login_interval_unit,
								protocolSettings.login_attempt_interval,
							),
						).toISOString(),
						endOfDay(new Date()).toISOString(),
					),
					status: false,
					user: employee,
					activity_type: 'MPIN_VERIFY',
				},
			});

	if (activityLog.length >= protocolSettings.mpin_max_retry) {
		const serviceBusBodyDtoD = {
			customer: employee,
			is_active: false,
			ip: '',
			login_type: 'MOBILE',
			activity_type: 'DEACTIVATE'
		}
		const serviceBusDtoD = {
			serviceType: 'verify-mpin-employee-auth',
			body: serviceBusBodyDtoD,
		};
		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDtoD);
		throw new HttpException(
			{
				message: 'Oops! ',
				sub:
					'Sorry the account has been locked. Please connect with our Customer Care.',
			},
			HttpStatus.FORBIDDEN,
		);
	}

	throw new HttpException(
		{
			message: 'Oops! Invalid MPIN',
			sub: `Sorry the MPIN was invalid.You have ${
				protocolSettings.mpin_max_retry - activityLog.length
			} attempts left before your account gets locked.`,
		},
		HttpStatus.UNAUTHORIZED,
	);
		
	} else {
		return { statusCode: 200, message: 'Mpin looks good' };
	}

	
}

async setMpin(employee: Customer, mpinDto: SetMpin): Promise<IResponse> {
	if (employee.is_mpin_set) {
		throw new HttpException(
			'Mpin is already set',
			HttpStatus.BAD_REQUEST,
		);
	}
	const serviceBusBodyDto = {
		idx: employee.idx,
		is_mpin_set: true, 
		mpin: mpinDto.mpin 
	}
	const serviceBusDto = {
		serviceType: 'set-mpin-employee-auth',
		body: serviceBusBodyDto,
	};

	await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

	return { statusCode: 200, message: 'Operation successful' };
}

async checkOtp(otp_code: string): Promise<OtpLog> {
	const checkOtpExists = await this.otpLogRepository.findOne({
		where: {
			otp_code,
			is_active: true,
		},
		relations: ['user'],
	});

	if (!checkOtpExists) {
		throw new HttpException('OTP is invalid', HttpStatus.BAD_REQUEST);
	}

	const protocolSettings = await this.protocolRepo.findOne({
		where: {
			is_active: true,
			is_obsolete: false,
		},
		select: ['otp_expiry_in_minutes'],
	});

	const diff = differenceInMinutes(
		new Date(),
		new Date(checkOtpExists.created_on),
	);

	if (diff > protocolSettings.otp_expiry_in_minutes) {
		throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
	}

	return checkOtpExists;
}

/**
	 *
	 *
	 * @param {string} otp_code
	 * @return {*}  {Promise<IResponse>}
	 * @memberof CustomerService
	 */

 async verifyOtp(otp_code: string): Promise<IResponse> {
	await this.checkOtp(otp_code);

	return { statusCode: 200, message: 'Otp looks good' };
}

async forgotPassword(forgotPassword: ForgotPassword): Promise<IResponse> {
	const checkCustomerWithEmail = await this.customerRepository.findOne({
		email: forgotPassword.email,
		is_obsolete: false
	});

	if (!checkCustomerWithEmail) {
		throw new HttpException(
			'Employee with email address not found',
			HttpStatus.NOT_FOUND,
		);
	}

	const otp_code = await this.nanoid();
	const otpLog = new OtpLog();

	otpLog.otp_code = otp_code;
	otpLog.user = checkCustomerWithEmail;
	const data = {
		otp_code,
		email: forgotPassword.email,
		name: checkCustomerWithEmail.first_name,
		operation: 'reset password',
	};
	const serviceBusBodyDto = {
		otpLog: otpLog,
		data:data
	}
	const serviceBusDto = {
		serviceType: 'forgot-password-employee-auth',
		body: serviceBusBodyDto,
	};

	await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

	return { statusCode: 200, message: `Please check your email for code` };
}

	/**
		 *
		 *
		 * @param {SignUpEmployee} signUpDto
		 * @return {*}  {Promise<{ message: string, data: AuthenticationPayload}>}
		 * @memberof CustomerService
		 */
	async signupEmployee(
		signUpDto: SignUpEmployee,
	): Promise<any> {
		const checkIdxExists = await this.customerRepository.findOne({
			where: {
				idx: signUpDto.idx,
				is_obsolete: false,
			},
		});

		if (!checkIdxExists) {
			throw new HttpException(
				'Employee with idx does not exist',
				HttpStatus.NOT_FOUND,
			);
		}

		if (checkIdxExists.is_registered) {
			throw new HttpException(
				'Employee is already registered',
				HttpStatus.BAD_REQUEST,
			);
		}

		const hashedPwd = await hashString(signUpDto.password);

		const serviceBusBodyDto = {
			signUpDto: signUpDto,
			password:hashedPwd,
			checkIdxExists:checkIdxExists
		}
		const serviceBusDto = {
			serviceType: 'signup-employee-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

		// as email will only available after this operation, adding it directly

		checkIdxExists.email = signUpDto.email;
		const token = await this.tokenService.generateAccessToken(
			checkIdxExists,
		);
		const refresh = await this.tokenService.generateRefreshToken(
			checkIdxExists,
			config.default.jwt.refresh_expiry
		);

		const payload = buildResponsePayload(checkIdxExists, token, refresh);

		return {
			message: 'Employee signup successful',
			data: payload,
		};
	}

	/**
	 * Logout the user from all the devices by invalidating all his refresh tokens
	 * @param employee The employee to logout
	 */

	async logoutFromAll(employee: Customer): Promise<IResponse> {
		return this.tokenService.deleteRefreshTokenForUser(employee);
	}

	async logout(employee: Customer, refreshToken: string): Promise<IResponse> {
		const payload = await this.tokenService.decodeRefreshToken(
			refreshToken,
		);

		return this.tokenService.deleteRefreshToken(employee, payload);
	}

	async changePasswordIdx(idx: string): Promise<IResponse> {
		const pwd = await hashString('Test@1234');

		await getConnection().getRepository(Customer).update(
			{
				idx,
			},
			{ mpin: '1234', password: pwd },
		);
		return {statusCode: 200, message: `Change password done`}
	}

	async getAllfilters(listQuery: ListQueryDto, idx: string): Promise<any> {
		const { page, limit, search, status } = listQuery;

		const offset = limit * (page - 1);
		const query = getRepository(SearchFilters)
			.createQueryBuilder('searchFilter')
			.where('searchFilter.is_obsolete = :is_obsolete', {
				is_obsolete: false,
			})
			.andWhere(
				new Brackets(qb => {
					qb.where('searchFilter.created_by = :idx', {
						idx,
					}).orWhere(
						'searchFilter.is_default_filter = :is_default_filter',
						{ is_default_filter: true },
					);
				}),
			)
			.leftJoinAndSelect('searchFilter.criteria', 'criteria');

		if (status !== '') {
			query.andWhere('searchFilter.is_active = :status', {
				status: status.toLowerCase() === 'active',
			});
		}

		if (search !== '') {
			query.andWhere(
				new Brackets(qb => {
					qb.where(`searchFilter.name LIKE :search`, {
						search: `${search.toUpperCase()}%`,
					});
				}),
			);
		}

		const [result, total] = await query
			.take(limit)
			.skip(offset)
			.getManyAndCount();

		// where we find filters data count

		const count = [];

		// constructs querybuilder promises for later execution

		for (let i = 0; i < result.length; i++) {
			const iterator = result[i];
			const qb = getRepository(Customer)
				.createQueryBuilder('customer')
				.where('customer.is_obsolete = :is_obsolete', {
					is_obsolete: false,
				})
				.andWhere('customer.employer_id = :id', { id: idx })
				.andWhere(
					`customer.${iterator.criteria.name} = :${iterator.criteria.name}${i}`,
					{
						[`${iterator.criteria.name}${i}`]: autoParseValues(
							iterator.value,
						),
					},
				)
				.getCount();

			count.push(qb);
		}

		// executing all querybuilder promises

		const filter_counts = await Promise.all(count);

		const pages = Math.ceil(total / limit);
		const host = getHost();

		return { ...paginate(pages, page, total, host, result), filter_counts };
	}

		/**
	 *
	 *
	 * @param {CreateFilterDto} createDto
	 * @param {string} idx
	 * @return {*}  {Promise<IResponse>}
	 * @memberof CustomerService
	 */

		 async createFilter(
			createDto: CreateFilterDto,
			idx: string,
		): Promise<IResponse> {
			const checkFilterExists = await this.searchFilterRepo.findOne({
				where: {
					name: createDto.name,
					is_active: true,
					is_obsolete: false,
				},
			});
	
			if (checkFilterExists) {
				throw new HttpException(
					'Filter with name already exists',
					HttpStatus.CONFLICT,
				);
			}
	
			const checkCriteraiExists = await this.criteriaRepo.findOne({
				where: {
					idx: createDto.criteria,
					is_obsolete: false,
				},
			});
	
			if (!checkCriteraiExists) {
				throw new HttpException(
					'Criteria does not exist',
					HttpStatus.NOT_FOUND,
				);
			}
	
			const searchFilter = new SearchFilters();
	
			searchFilter.name = createDto.name;
			searchFilter.value = createDto.value;
			searchFilter.criteria = checkCriteraiExists;
			searchFilter.is_default_filter = false;
			searchFilter.created_by = idx;


			const serviceBusBodyDto = {
				searchFilter:searchFilter
			}
			const serviceBusDto = {
				serviceType: 'create-filter-employee-auth',
				body: serviceBusBodyDto,
			};
		
			await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
	
			return { statusCode: 200, message: 'Operation successful' };
		}

			/**
	 *
	 *
	 * @param {string} idx
	 * @return {*}  {Promise<SearchFilters>}
	 * @memberof CustomerService
	 */
	async getFilterByIdx(
		idx: string,
		emploerIdx: string,
	): Promise<SearchFilters> {
		// let res = await this.cacheManager.get<any>('filter ' + idx);

		// if (!res) {
			let res = await this.searchFilterRepo.findOne({
				where: [
					{
						idx,
						is_obsolete: false,
						created_by: emploerIdx,
					},
					{ idx, is_obsolete: false, is_default_filter: true },
				],
				relations: ['criteria'],
			});

			if (!res) {
				throw new HttpException(
					'Filter not found',
					HttpStatus.NOT_FOUND,
				);
			}

			// this.cacheManager.set('filter ' + idx, res, {
			// 	ttl: 600,
			// });
		// }

		return res;
	}



	async executeFilterOnce(
		createDto: ExecuteFilter,
		idx: string,
	): Promise<{ count: number }> {
		const criteria = await this.criteriaRepo.findOne({
			where: { idx: createDto.criteria, is_active: true },
		});

		if (!criteria) {
			throw new HttpException(
				'The selected criteria not found',
				HttpStatus.NOT_FOUND,
			);
		}

		const query = getRepository(Customer)
			.createQueryBuilder('customer')
			.where('customer.is_obsolete = :is_obsolete', {
				is_obsolete: false,
			})
			.andWhere('customer.employer_id = :id', { id: idx })
			.andWhere('customer.worker_status_type = UPPER(:active)', {
				active: 'active'.toUpperCase(),
			})
			.andWhere(`customer.${criteria.name} = :value`, {
				value: autoParseValues(createDto.value),
			});

		return { count: await query.getCount() };
	}

		/**
	 *
	 *
	 * @param {UpdateFilterDto} updateDto
	 * @param {string} idx
	 * @return {*}  {Promise<IResponse>}
	 * @memberof CustomerService
	 */
		 async upateFilter(
			updateDto: UpdateFilterDto,
			idx: string,
			employerIdx: string,
		): Promise<IResponse> {
			const filterExists = await this.searchFilterRepo.findOne({
				where: [
					{ idx, is_obsolete: false, created_by: employerIdx },
					{ idx, is_obsolete: false, is_default_filter: true },
				],
			});
	
			if (!filterExists) {
				throw new HttpException(
					'Filter with given Idx not found',
					HttpStatus.NOT_FOUND,
				);
			}
	
			if (filterExists.is_default_filter) {

				const serviceBusBodyDto = {
					idx:idx,
					employerIdx:employerIdx,
					is_active:updateDto.is_active,
					type:"default"

				}
				const serviceBusDto = {
					serviceType: 'update-filter-employee-auth',
					body: serviceBusBodyDto,
				};
				
				await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				// await this.cacheManager.reset();
	
				return { statusCode: 200, message: 'Operation successful' };
			}
	
			const checkFilterNameExists = await this.searchFilterRepo.findOne({
				where: {
					name: updateDto.name,
					idx: Not(idx),
					is_obsolete: false,
					created_by: employerIdx,
				},
			});
	
			if (checkFilterNameExists) {
				throw new HttpException(
					'Filter with name already exists',
					HttpStatus.CONFLICT,
				);
			}
	
			if (updateDto.criteria) {
				const checkCriteraiExists = await this.criteriaRepo.findOne({
					where: {
						idx: updateDto.criteria,
						is_active: true,
						is_obsolete: false,
					},
				});
	
				if (!checkCriteraiExists) {
					throw new HttpException(
						'Criteria does not exist',
						HttpStatus.NOT_FOUND,
					);
				}
	
				updateDto.criteria = checkCriteraiExists;
			}
			const serviceBusBodyDto = {
				idx:idx,
				employerIdx:employerIdx,
				updateDto:updateDto,
				type:""

			}
			const serviceBusDto = {
				serviceType: 'update-filter-employee-auth',
				body: serviceBusBodyDto,
			};
			
			await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
		
			// await this.cacheManager.reset();
	
			return { statusCode: 200, message: 'Operation successful' };
		}


		/**
	 *
	 *
	 * @param {string} idx
	 * @return {*}  {Promise<IResponse>}
	 * @memberof CustomerService
	 */
		 async deleteFilter(idx: string, employerIdx: string): Promise<IResponse> {
			const filterExists = await this.searchFilterRepo.findOne({
				where: { idx, is_obsolete: false, created_by: employerIdx },
			});
	
			if (!filterExists) {
				throw new HttpException(
					'Filter with given Idx not found or is default filter',
					HttpStatus.NOT_FOUND,
				);
			}
	
			if (filterExists.is_default_filter) {
				throw new HttpException(
					'Cannot delete default filter',
					HttpStatus.BAD_REQUEST,
				);
			}
			const serviceBusBodyDto = {
				idx:idx,
				employerIdx:employerIdx,

			}
			const serviceBusDto = {
				serviceType: 'delete-filter-employee-auth',
				body: serviceBusBodyDto,
			};
			
			await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
	
			// await this.cacheManager.reset();
	
			return { statusCode: 200, message: 'Filter deleted' };
		}

}
