import { SetPassword } from '@dtos/SetPassword.dto';
import { EmployerLoginDto } from '@dtos/employerLogin.dto';
import { EmailLog } from '@entities/EmailLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog';
import { Permission } from '@entities/Permission';
import { Protocol } from '@entities/Protocol';
import { Users } from '@entities/Users';
import { OtpLog } from '@entities/OtpLog';
import { ChangeUserPass } from '@dtos/ChangeUserPass.dto';
import {
	BadRequestException,
	//CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import {Repository,Between, getConnection,In ,getManager} from 'typeorm';
import { uniqueID, hashString } from '@utils/helpers';
import { subtractDate } from '@utils/helpers';
import { JwtService } from '@nestjs/jwt';
import { TokensService} from '@modules/token/tokens.service';
import { InjectRepository } from '@nestjs/typeorm';
import { verifyCaptcha } from '@utils/captcha';
import * as argon from 'argon2';
import allView from '@common/constants/allRoutes';
import allmappedData from '@common/constants/mappedData';
import {IResponse} from '@common/interfaces/response.interface';
import { Cache } from 'cache-manager';
import config from '@config/index';
import {  differenceInMinutes } from 'date-fns';
import { objectArrayToArray } from '@rubiin/js-utils';
import { UserLoginDto,ForgotPassword,
	ResetPassword, } from '@dtos/Derived.dto';
import { customAlphabet } from 'nanoid/async';
import { ServiceBusSenderService } from '@modules/service-bus-sender/service-bus-sender.service';
import { ServiceBusClient } from '@azure/service-bus';
import { ProtocolUpdateDto } from '@dtos/protocol.dto';
import { EmployerSettings } from '@entities/EmployerSettings.entity';
import { AddUpdatesettings } from '@dtos/create-setting.dto';
import { ActivityLog } from '@entities/ActivityLog';
import {
	endOfDay,
	startOfDay,
} from 'date-fns';
// Service Bus Connection String
const connectionString = config.sbSenderConnectionString;
// Max Retries
const maxRetries = config.sbSenderMaxRetries;
const REQUEST_APPROVE_SUCCESS_MSG = 'Request Approved Successfully';
const topicName = config.queueName;
const asyncTopicName = config.topicName;

@Injectable()
export class EmployerAuthService {
	private readonly nanoid = customAlphabet('1234567890', 6);
		constructor(
			//@Inject(CACHE_MANAGER) private cacheManager: Cache,
			private readonly jwtService: JwtService,
			private readonly tokenService: TokensService,
			private readonly serviceBusService: ServiceBusSenderService,
			@InjectRepository(Users)
			private readonly usersRepo: Repository<Users>,
			@InjectRepository(ActivityLog)
			private readonly activityLogRepo: Repository<ActivityLog>,
			@InjectRepository(EmailLog)
			private readonly emailLogRepo: Repository<EmailLog>,
			@InjectRepository(Permission)
			private readonly permissionRepo: Repository<Permission>,
			@InjectRepository(Protocol)
			private readonly protocolRepo: Repository<Protocol>,
			@InjectRepository(EmployerSettings)
			private readonly employerSettingsRepo: Repository<EmployerSettings>,
			@InjectRepository(OtpLog)
			private readonly otpRepo: Repository<OtpLog>,
			@InjectRepository(PasswordHistoryLog)
			private readonly passwordHistoryRepo: Repository<PasswordHistoryLog>,
	) {}
		
	async loginEmployer(userDto: EmployerLoginDto, ip: string) {
		let scenario = 0;
		const isCaptchaCorrect = await verifyCaptcha(
			userDto.captcha,
			userDto.captcha_token,
		);
		userDto.password = unescape(userDto.password); //decoding the encoded special characters over http request
		if (!isCaptchaCorrect) {
			throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST);
		}

		const user = await this.usersRepo.findOne({
			where: {
				email: userDto.email,
				is_obsolete: false,
			},
			relations: ['user_type'],
		});

		console.info(user);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (user.is_obsolete) {
			throw new BadRequestException('Invalid credentials');
		}

		// this means orbis admin as orbis admin does not have usertype or is null

		if (user?.user_type?.user_type !== 'Default-Employer') {
			throw new BadRequestException(
				'Cannot login orbisadmin to employer dashboard',
			);
		}

		if (user) {
			if (user.password === '' || !user.password) {
				throw new HttpException('Password not set', HttpStatus.BAD_REQUEST);
			}

			if (await argon.verify(user.password, userDto.password)) {
				if (!user.is_active) {
					throw new UnauthorizedException(
						'Account was locked due to multiple failed logins',
					);
				}
				//Reset Activity Log as this is success scenario
				const activityLogArray = await this.activityLogRepo.find({
					where: {
						user_id: user,
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
						serviceType: 'update-activity-log-employer-login',
						body: serviceBusBodyDto,
					};
			
					await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				}

				//scenario = 0;
				//Saving successfull login activity log
				const serviceBusBodyDto = {
					user: user,
					ip: ip
				}
				const serviceBusDto = {
					serviceType: 'save-activity-log-employer-login',
					body: serviceBusBodyDto,
				};
				await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				const payload = {
					idx: user.idx,
					email: user.email,
				};
				const accessToken = await this.tokenService.generateAccessToken(user);
				const { payroll_system: provider_name, contact_name, idx } = user;
				const response = {
					provider_name,
					contact_name,
					idx,
				};

				return { message: 'Successfully signed in', accessToken, response };
				
			} else {
				//scenario = 1;
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
					ip: ip
				}
				const serviceBusDto = {
					serviceType: 'save-activity-log-employer-login',
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
						user_id: user,
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
						serviceType: 'update-user-repo-login',
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
		} else {
			throw new UnauthorizedException('Invalid credentials');
		}
	}

	async loginUser(userDto: UserLoginDto, ip: string) {
		let scenario = 0;
		const isCaptchaCorrect = await verifyCaptcha(
			userDto.captcha,
			userDto.captcha_token,
		);
		userDto.password = unescape(userDto.password); //decoding the encoded special characters over http request
		if (!isCaptchaCorrect) {
			throw new HttpException('Captcha is incorrect', HttpStatus.BAD_REQUEST);
		}

		const user = await this.usersRepo.findOne({
			where: {
				email: userDto.email,
				is_obsolete: false,
			},
			relations: ['user_type'],
		});

		if (!user) {
			console.log('User not found ------');
			throw new UnauthorizedException('Invalid credentials');
		}

		if (user.is_obsolete) {
			console.log('User is obsolete ------');
			throw new BadRequestException('Invalid credentials');
		}

		// this means employer

		console.info(user);

		if (user?.user_type?.user_type === 'Default-Employer') {
			throw new BadRequestException('Cannot login employer to admin dashboard');
		}

		if (user) {
			if (user.password === '' || !user.password) {
				throw new HttpException('Password not set', HttpStatus.BAD_REQUEST);
			}

			if (await argon.verify(user.password, userDto.password)) {
				console.log('Password Verified successflly ------');
				if (!user.is_active) {
					console.log('User is not active ------');
					throw new UnauthorizedException(
						'Account was locked due to multiple failed logins',
					);
				}
				//Reset Activity Log as this is success scenario
				const activityLogArray = await this.activityLogRepo.find({
					where: {
						user_id: user,
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
						serviceType: 'update-activity-log-user-login',
						body: serviceBusBodyDto,
					};
			
					await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				}
				//scenario=0;
				const serviceBusBodyDto = {
					user: user,
					ip: ip
				}
				const serviceBusDto = {
					serviceType: 'save-activity-log-user-login',
					body: serviceBusBodyDto,
				};
				await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
				const payload = {
					email: userDto.email,
					id: user.id,
					idx: user.idx,
					is_superadmin: user.is_superadmin,
				};
	
				const accessToken = await this.tokenService.generateAccessToken(user);
	
				
	
				const { id, idx, contact_name, email, address, is_superadmin } = user;
	
				const response = {
					id,
					idx,
					email,
					address,
					contact_name,
					is_superadmin,
				};
				return { message: 'Successfully signed in', accessToken, response };
			} else {
				//scenario=1;
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
					ip: ip
				}
				const serviceBusDto = {
					serviceType: 'save-activity-log-user-login',
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
						user_id: user,
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
						serviceType: 'update-user-repo-login',
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
		} else {
			throw new UnauthorizedException('Invalid credentials');
		}
	}

	async checkLink(token: string): Promise<IResponse> {
		const isLinkUsed = await this.emailLogRepo.findOne({
			where: {
				token,
			},
			select: ['is_active'],
		});

		if (!isLinkUsed) {
			throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
		}

		if (!isLinkUsed.is_active) {
			throw new HttpException('Token already used', HttpStatus.BAD_REQUEST);
		}

		return { statusCode: 200, message: 'Token is correct' };
	}

	async setPassword(passwordDto: SetPassword): Promise<IResponse> {
		// find user info from emaillog table with the token

		const link = await this.emailLogRepo.findOne({
			where: {
				token: passwordDto.token,
			},
			relations: ['user'],
		});

		if (!link.is_active) {
			throw new HttpException('Link is used', HttpStatus.NOT_FOUND);
		}

		if (!link) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const pwdHash = await hashString(passwordDto.password);

		// hash password provided , update the user password in users table, save the password log
		const serviceBusBodyDto = {
			idx: link.user.idx ,
			password: pwdHash,
			token: passwordDto.token,
			user_id: link.user
		}
		const serviceBusDto = {
			serviceType: 'set-password-employer-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
		return { statusCode: 200, message: 'Password set' };
	}

	public async authenticateRoute(
		header: { data?: string; method?: any; url?: any },
		result: any[],
	) {
		const permission = await this.permissionRepo.findOne({
			where: { method: header.method, url: header.url },
		});

		if (!permission) {
			throw new HttpException(
				'The route permission does not exist',
				HttpStatus.NOT_FOUND,
			);
		}

		return result.some(el => el.alias === permission.alias);
	}

	// public async checkAccessToken(header: {
	// 	data: any;
	// 	url?: any;
	// 	method?: any;
	// }) {
	// 	let response: { idx: string };

	// 	// get token from header
	// 	console.log("//////////////////////");
	// 	console.log(header);
	// 	const token = header.data.split(' ')[1];

	// 	// verify jwt for expiry and validity

	// 	try {
	// 		response = await this.jwtService.verify(token);
	// 	} catch (e) {
	// 		if (e.name === 'TokenExpiredError') {
	// 			throw new UnprocessableEntityException('Token expired');
	// 		} else {
	// 			throw new UnprocessableEntityException('Token malformed');
	// 		}
	// 	}

	// 	const users = await this.usersRepo.findOne({
	// 		where: { idx: response.idx },
	// 		relations: ['user_type'],
	// 	});

	// 	if (!users) {
	// 		throw new HttpException(
	// 			'User from token not found',
	// 			HttpStatus.NOT_FOUND,
	// 		);
	// 	}

	// 	console.info('user is ' + users.company_name);

	// 	let result = [];
	// 	let validRoute: boolean;

	// 	// if user is admin, no need to check any permissions

	// 	if (users.is_superadmin) {
	// 		return {
	// 			msg: 'Success',
	// 			idx: users.idx,
	// 			username: users.username,
	// 			is_superadmin: true,
	// 		};
	// 	} else {
	// 		result = await getConnection().query('EXECUTE allowed_routes @0', [
	// 			users.user_type.idx,
	// 		]);

	// 		// check whether the requested route lies in the permission

	// 		validRoute = await this.authenticateRoute(header, result);

	// 		console.info(validRoute, 'ValidRoute?');

	// 		if (!validRoute) {
	// 			throw new HttpException('Not accessible route', HttpStatus.BAD_REQUEST);
	// 		}

	// 		return {
	// 			msg: 'Success',
	// 			idx: users.idx,
	// 			username: users.username,
	// 			is_superadmin: users.is_superadmin,
	// 		};
	// 	}
	// }

	public async sendAllMappedRoutes(allAccessibleRoutes: any[]) {
		const mappedRoutes = [];

		for (const route of allAccessibleRoutes) {
			if (allmappedData.hasOwnProperty(route)) {
				const accessData = allmappedData[route];

				for (const data of accessData) {
					if (!mappedRoutes.includes(data)) {
						mappedRoutes.push(data);
					}
				}
			}
		}

		const routes = {};

		for (const element of mappedRoutes) {
			routes[element] = true;
		}

		return routes;
	}

	public async listAllAccessibleAlias(userRequesting: Users) {
		// let allowedRoutes = await this.cacheManager.get<any>(
		// 	'user ' + userRequesting.id,
		// );

		//if (!allowedRoutes) {
			let allowedRoutes;
			const users = await this.usersRepo.findOne({
				where: { id: userRequesting.id },
				relations: ['user_type'],
			});

			console.info('incoming user ' + users, 'Authservice');

			let result = [];

			if (users.is_superadmin) {
				allowedRoutes = allView;
			} else {
				result = await getConnection().query(
					'EXECUTE list_accessible_routes @0',
					[users.user_type.idx],
				);

				const allAccessibleRoutes = objectArrayToArray(result, 'alias');

				console.info('before mapped route');
				console.warn(result, 'AuthService before');

				allowedRoutes = this.sendAllMappedRoutes(allAccessibleRoutes);

				console.info('after mapped route');

				console.info('AuthService after ' + allowedRoutes);
			}

			// this.cacheManager.set('user ' + userRequesting.id, allowedRoutes, {
			// 	ttl: config.redisTTL,
			// });
		//}

		return allowedRoutes;
	}

	async getAllPermission(query?: string): Promise<Permission[]> {
		const withQueryObject = {
			is_obsolete: false,
			permission_type: query?.toUpperCase(),
		};

		const withoutQueryObject = {
			is_obsolete: false,
		};

		const result = await this.permissionRepo.find({
			where: query ? withQueryObject : withoutQueryObject,
			select: ['idx', 'base_name', 'url', 'method', 'is_active', 'alias'],
		});

		if (!result) {
			throw new HttpException('Not found', HttpStatus.NOT_FOUND);
		}

		return result;
	}

	async getPermissionByIdx(idx: string): Promise<Permission> {
		const permission = await this.permissionRepo.findOne({
			idx,
			is_obsolete: false,
		});

		if (!permission) {
			throw new HttpException(
				'Permission with idx not found',
				HttpStatus.NOT_FOUND,
			);
		}

		return permission;
	}

	async getAllProtocol(): Promise<Protocol[]> {
		return this.protocolRepo.find({
			where: {
				is_active: true,
				is_obsolete: false,
			},
		});
	}

	async updateProtocol(
		idx: string,
		protocolUpdate: ProtocolUpdateDto,
	): Promise<IResponse> {
		const protocolExists = await this.protocolRepo.findOne({
			idx,
			is_obsolete: false,
		});

		if (!protocolExists) {
			throw new HttpException(
				'protocol with given Idx not found',
				HttpStatus.NOT_FOUND,
			);
		}
		const serviceBusBodyDto = {
			idx: idx ,
			protocolUpdate: protocolUpdate,
		}
		const serviceBusDto = {
			serviceType: 'update-protocol-employer-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

		return { statusCode: 200, message: 'Protocol updated' };
	}

	async getSetting(idx: string): Promise<EmployerSettings> {
		let setting = await this.employerSettingsRepo.findOne({
			created_by: idx,
			is_obsolete: false,
		});

		if (!setting) {
			setting = new EmployerSettings(false, false);
		}

		return setting;
	}

	async addUpdateSettings(
		settingsDto: AddUpdatesettings,
		idx: string,
	): Promise<IResponse> {
		const settings = await this.employerSettingsRepo.findOne({
			where: {
				created_by: idx,
				is_obsolete: false,
			},
		});

		const serviceBusBodyDto = {
			settings: settings,
			settingsDto: settingsDto,
			idx: idx
		}
		const serviceBusDto = {
			serviceType: 'add-update-settings-employer-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
		return { statusCode: 200, message: 'Operation successful' };
	}

	async forgotPassword(forgotPassword: ForgotPassword): Promise<IResponse> {
		const checkEmployeeWithEmail = await this.usersRepo.findOne({
			email: forgotPassword.employer_email,
			is_obsolete: false
		});

		if (!checkEmployeeWithEmail) {
			throw new HttpException(
				'Employer with email address not found',
				HttpStatus.NOT_FOUND,
			);
		}

		const otp_code = await this.nanoid();
		const otpLog = new OtpLog();

		otpLog.otp_code = otp_code;
		otpLog.user = checkEmployeeWithEmail;

		const serviceBusBodyDto = {
			otpLog: otpLog,
			otp_code: otp_code,
			email: forgotPassword.employer_email,
			name: checkEmployeeWithEmail.contact_name,
		}
		const serviceBusDto = {
			serviceType: 'forgot-password-employer-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
		return { statusCode: 200, message: `Please check your email for code` };
	}

	async resetPassword(resetPassword: ResetPassword): Promise<IResponse> {
		const checkOtpExists = await this.otpRepo.findOne({
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
			id: checkOtpExists.user.id ,
			password: pwdHash
		}
		console.log('Resset Password Service bus Data sent --->' + JSON.stringify(serviceBusBodyDto));
		const serviceBusDto = {
			serviceType: 'reset-password-employer-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);

		return { statusCode: 201, message: `Password updated successfully` };
	}

	async changePassword(
		password: ChangeUserPass,
		idx: string,
	): Promise<IResponse> {
		password.password = unescape(password.password); //decoding the encoded special characters over http request
		password.current_password = unescape(password.current_password);
		if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d@$!%*?&-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{8,}$/.test(password.password))) {
			console.log('Manual Check Failed ......-------------------->');
			throw new HttpException(
				'New password must contain at least 1 special character,uppercase letter, lowercase letter and number each and must be between 8 to 64 chacarters long',
				HttpStatus.BAD_REQUEST,
			);
		}
		const userExists = await this.usersRepo.findOne({
			idx,
			is_obsolete: false,
		});

		if (!userExists) {
			throw new HttpException('User does not exist', HttpStatus.CONFLICT);
		}

		const checkPassword = await argon.verify(
			userExists.password,
			password.current_password,
		);

		if (!checkPassword) {
			throw new HttpException(
				'Current password do not match',
				HttpStatus.BAD_REQUEST,
			);
		}

		const { pw_repeatable_after } = await this.protocolRepo.findOne({
			select: ['pw_repeatable_after'],
		});
		const previousPassword = await this.passwordHistoryRepo.find({
			where: {
				user_id: userExists,
			},
			select: ['password'],
			take: pw_repeatable_after,
			order: {
				created_on: 'DESC',
			},
		});

		let equalsPreviousPassword = false;

		/* eslint-disable no-await-in-loop */
		for (const el of previousPassword) {
			equalsPreviousPassword = await argon.verify(
				el.password,
				password.password,
				{
					parallelism: 2,
				},
			);
			if (equalsPreviousPassword) {
				break;
			}
		}

		if (equalsPreviousPassword) {
			throw new HttpException(
				'Same password can only be used after 3 times',
				HttpStatus.BAD_REQUEST,
			);
		}

		password.password = await hashString(password.password);

		const serviceBusBodyDto = {
			user_id: userExists,
			password: password.password
		}
		const serviceBusDto = {
			serviceType: 'change-password-employer-auth',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(asyncTopicName, serviceBusDto);
		return { statusCode: 200, message: 'User password changed' };
	}

}


