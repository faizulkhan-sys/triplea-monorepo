import { EmailLog } from '@entities/EmailLog';
import { Permission } from '@entities/Permission';
import { Protocol } from '@entities/Protocol';
import { Users } from '@entities/Users';
import { UsersTemp } from '@entities/UsersTemp';
import { UserType } from '@entities/UserType';
import { Customer } from '@entities/Customer.entity';
import { WorkLog } from '@entities/WorkLog.entity';
import { IdEmployeeDto, CheckEmail } from '@dtos/Derived.dto';
import { Status } from '@common/constants/Status.enum';
import { WrongUserFound } from '@dtos/wronguser.dto';
import { WrongUserLog } from '@entities/WrongUserLog';
import { InviteEmployerLog } from '@entities/InviteEmployerLog';
import { InviteUserMobile } from '@dtos/Derived.dto';
import { NotifyDto } from '@dtos/Notify.dto';
import { UpdateUser } from '@dtos/UpdateUser.dto';
import { CreateUser } from '@dtos/CreateUser.dto';
import { omit } from '@rubiin/js-utils';
import { Operations } from '@common/constants/operations.enum';
import { SalaryType } from '@common/constants/paycycle';
import { UserTypeTemp } from '@entities/UserTypeTemp';
import { classToPlain } from 'class-transformer';
import { CreateUserType } from '@dtos/CreateUserType.dto';
import { PermissionUserType } from '@entities/PermissionUserType';
import { UpdateUserTypeName } from '@dtos/UpdateUserTypeName.dto';
import { PermissionUserTypeTemp } from '@entities/PermissionUserTypeTemp';
import { UpdateUserTypePermissions } from '@dtos/UpdateUserTypePermission.dto';
import {
	CACHE_MANAGER,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from '@nestjs/common';
import { Axios, uniqueID,getHost, determinePayCycleDateRange, calculateGrossDailyPay, paginate } from '@utils/helpers';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, getConnection, Repository, Brackets,In ,Not} from 'typeorm';
import {IResponse, Ipagination,response} from '@common/interfaces/response.interface';
import { ListActiveUserDto, ListPendingDto,ListActiveUserTypeDto } from '@dtos/ListQuery.dto';
// import { Cache } from 'cache-manager';
import config from '@config/index';
import { startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { AddOrChangeNumber } from '@dtos/Derived.dto';
import { ServiceBusSenderService } from '@modules/service-bus-sender/service-bus-sender.service';
import { ServiceBusClient } from '@azure/service-bus';
import { ApproveRejectDto } from '@dtos/AppproverReject.dto';
import { database } from 'typeorm.config';
import { CompanyUser} from '@entities/CompanyUser';
import { EmployerSettings } from '@entities/EmployerSettings.entity';
// Service Bus Connection String
const connectionString = config.sbSenderConnectionString;
// Max Retries
const maxRetries = config.sbSenderMaxRetries;
const REQUEST_APPROVE_SUCCESS_MSG = 'Request Approved Successfully';
const topicName =config.topicName;
const queueName = config.queueName;

@Injectable()
export class UserOperationService {
		constructor(
			@InjectRepository(Permission)
			private readonly permissionRepo: Repository<Permission>,
			@InjectRepository(PermissionUserType)
			private readonly permissionUserTypeRepo: Repository<PermissionUserType>,
			@InjectRepository(PermissionUserTypeTemp)
			private readonly permissionUserTypeTemp: Repository<PermissionUserTypeTemp>,
			// @Inject(CACHE_MANAGER) private cacheManager: Cache,
			private readonly serviceBusService: ServiceBusSenderService,
			@InjectRepository(Users)
			private readonly usersRepo: Repository<Users>,
			@InjectRepository(WrongUserLog)
			private readonly wrongUserLogRepo: Repository<WrongUserLog>,
			@InjectRepository(InviteEmployerLog)
			private readonly inviteEmployerRepo: Repository<InviteEmployerLog>,
			@InjectRepository(UsersTemp)
			private readonly usersTempRepo: Repository<UsersTemp>,
			@InjectRepository(UserType)
			private readonly userTypeRepo: Repository<UserType>,
			@InjectRepository(Customer)
			private readonly customerRepository: Repository<Customer>,
			@InjectRepository(WorkLog)
			private readonly workLogRepo: Repository<WorkLog>,
			@InjectRepository(UserTypeTemp)
			private readonly userTypeTempRepo: Repository<UserTypeTemp>,
			@InjectRepository(CompanyUser)
			private readonly companyUserRepo: Repository<CompanyUser>,
	) {}
		

	async getEmployerByName(query: string) {
		// let data = await this.cacheManager.get('usersearch ' + query);

		// if (!data) {
			let data = await getConnection()
				.getRepository(Users)
				.createQueryBuilder('Users')
				.select(['Users.idx', 'Users.company_name'])
				.where(
					`Users.company_name LIKE UPPER(:search) and Users.user_type = 1 `,
					{ search: `${query.toUpperCase()}%` },
				)
				.getMany();

			// this.cacheManager.set('usersearch ' + query, data, {
			// 	ttl: config.redisTTL,
			// });
		// }

		return { data };
	}

	async getEmployerByZip(
		query: string,
	): Promise<{
		data: {
			idx: string;
			contact_name: string;
			company_name: string;
			zip_code: string;
		}[];
	}> {
		// let data = await this.cacheManager.get<any>('user ' + query);

		// if (!data) {
			let data = await getConnection()
				.getRepository(Users)
				.createQueryBuilder('Users')
				.select([
					'Users.idx',
					'Users.contact_name',
					'Users.zip_code',
					'Users.company_name',
				])
				.where(`Users.zip_code = :search`, { search: `${query}` })
				.getMany();

			// this.cacheManager.set('user ' + query, data, { ttl: config.redisTTL });
		// }

		return { data };
	}

	async wrongUserFound(wrongUser: WrongUserFound): Promise<IResponse> {
		const reqExists = await this.wrongUserLogRepo.findOne({
			where: {
				employee_id: wrongUser.employee_id,
				ssn_no: wrongUser.ssn_no,
				employer_id: wrongUser.employer_id,
				status: 'PENDING',
			},
		});

		if (reqExists) {
			throw new HttpException(
				'Request already exists, Please wait',
				HttpStatus.CONFLICT,
			);
		}

		const serviceBusBodyDto = {
			employee_email: wrongUser.employee_email,
		}
		const serviceBusDto = {
			serviceType: 'wrong-user-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);
		return { statusCode: 200, message: 'Your details have been sent to orbis' };
	}
	
	async getUserByIdx(idx: string): Promise<Users> {
		// let res = await this.cacheManager.get<any>('user ' + idx);

		// if (!res) {
			let res = await this.usersRepo.findOne({
				relations: ['user_type'],
				where: { idx, is_obsolete: false, is_superadmin: false },
			});

			if (!res) {
				throw new HttpException(
					'User with given idx not found',
					HttpStatus.NOT_FOUND,
				);
			}
		// 	this.cacheManager.set('user ' + idx, res, { ttl: config.redisTTL });
		// }

		return res;
	}

	async contactMe(employer_email: string): Promise<IResponse> {
		const checkForEmployer = await this.inviteEmployerRepo.findOne({
			where: {
				employer_email: employer_email,
				status: 'INVITED',
				is_active: true,
			},
		});

		if (checkForEmployer) {
			throw new HttpException(
				'Request for employer  already exists',
				HttpStatus.CONFLICT,
			);
		}

		const serviceBusBodyDto = {
			email: employer_email,
		}
		const serviceBusDto = {
			serviceType: 'contact-me-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		return { statusCode: 200, message: 'The operation was successful' };
	}

	async inviteEmployerMobile(inviteDto: InviteUserMobile): Promise<IResponse> {
		const checkForEMployerInvites = await this.inviteEmployerRepo.findOne({
			where: {
				employer_email: inviteDto.employer_email,
				status: 'INVITED',
				is_active: true,
			},
		});

		if (checkForEMployerInvites) {
			throw new HttpException(
				'Invite for employer with invite already exists',
				HttpStatus.CONFLICT,
			);
		}

		const serviceBusBodyDto = {
			employee_email: inviteDto.employee_email,
			employer_email: inviteDto.employer_email
		}
		const serviceBusDto = {
			serviceType: 'invite-employer-mobile-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		return { statusCode: 200, message: 'The operation was successful' };
	}

	async setNotification(inviteDto: NotifyDto): Promise<IResponse> {
		const checkExists = await this.inviteEmployerRepo.findOne({
			where: {
				employer_email: inviteDto.employer_email,
				is_obsolete: false,
			},
		});

		if (!checkExists) {
			throw new HttpException(
				'Invite for employer with email does not exist',
				HttpStatus.NOT_FOUND,
			);
		}

		const serviceBusBodyDto = {
			employer_email: inviteDto.employer_email,
			notify: inviteDto.notify 
		}
		const serviceBusDto = {
			serviceType: 'set-notification-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		return { statusCode: 201, message: 'The operation was successful' };
	}

	async getAllUsers(listQuery: ListActiveUserDto): Promise<Ipagination> {
		const { limit, search, page, user_type, status } = listQuery;

		const offset = limit * (page - 1);

		const query = getConnection()
			.getRepository(Users)
			.createQueryBuilder('Users')
			.where('Users.is_obsolete = :is_obsolete', {
				is_obsolete: false,
			})
			.andWhere('Users.is_superadmin = :is_superadmin', {
				is_superadmin: false,
			})
			.leftJoinAndSelect('Users.user_type', 'user_type');

		if (status !== '') {
			query.andWhere('Users.is_active = :status', {
				status: status.toLowerCase() === 'active',
			});
		}

		if (user_type !== '') {
			query.andWhere('user_type.user_type = :user_type', { user_type });
		}

		if (search !== '') {
			query.andWhere(
				new Brackets(qb => {
					qb.where(
						`Users.contact_name LIKE UPPER(:search) OR Users.email LIKE UPPER(:search) OR Users.username LIKE UPPER(:search) OR Users.employer_no LIKE UPPER(:search)`,
						{ search: `${search.toUpperCase()}%` },
					);
				}),
			);
		}

		const [result, total] = await query
			.take(limit)
			.skip(offset)
			.getManyAndCount();

		const pages = Math.ceil(total / limit);
		const host = getHost();

		return paginate(pages, page, total, host, result);
	}

	async getAllPendingUsers(
		listQuery: ListPendingDto,
		userRequesting: Users,
	): Promise<Ipagination> {
		const { limit, search, page, request_type } = listQuery;

		const offset = limit * (page - 1);

		const query = getConnection()
			.getRepository(UsersTemp)
			.createQueryBuilder('UsersTemp')
			.where('UsersTemp.status = :status', {
				status: Status.PENDING,
			})
			.andWhere('UsersTemp.is_obsolete = :is_obsolete', {
				is_obsolete: false,
			})
			.leftJoinAndSelect('UsersTemp.user_type', 'user_type');

		if (request_type === 'by') {
			query.andWhere('UsersTemp.created_by = :idx', {
				idx: userRequesting.idx,
			});
		}
		if (request_type === 'to') {
			query.andWhere('UsersTemp.created_by != :idx', {
				idx: userRequesting.idx,
			});
		}

		if (search !== '') {
			query.andWhere(
				new Brackets(qb => {
					qb.where(
						`UsersTemp.company_name LIKE UPPER(:search) OR UsersTemp.email LIKE UPPER(:search)`,
						{ search: `${search.toUpperCase()}%` },
					);
				}),
			);
		}

		const [result, total] = await query
			.take(limit)
			.skip(offset)
			.getManyAndCount();

		const pages = Math.ceil(total / limit);
		const host = getHost() +'pending/';

		return paginate(pages, page, total, host, result);
	}

	async getAPendingUser(idx: string): Promise<any> {
		// let res = await this.cacheManager.get('puser ' + idx);

		// if (!res) {
			let res = await this.usersTempRepo.findOne({
				where: { idx, is_obsolete: false, status: Status.PENDING },
				join: {
					alias: 'users',
					leftJoinAndSelect: {
						user_type: 'users.user_type',
						user: 'users.user',
						old_user_type: 'user.user_type',
					},
				},
			});

			if (!res) {
				throw new HttpException(
					'Customer with Idx not found',
					HttpStatus.NOT_FOUND,
				);
			}

		// 	this.cacheManager.set('puser ' + idx, res, { ttl: config.redisTTL });
		// }

		return res;
	}

	// async deleteCacheWithPattern(pattern: string): Promise<void> {
	// 	const keys = await this.cacheManager.store.keys();
	// 	const userCaches = keys.filter((el: string) => el.includes(pattern));

	// 	if (userCaches.length > 0) await this.cacheManager.del(userCaches);
	// }

	async updateUser(
		user: UpdateUser,
		idx: string,
		userRequesting: Users,
	): Promise<IResponse> {
		const userExists = await this.usersRepo.findOne({
			idx,
			is_obsolete: false,
		});

		if (!userExists) {
			throw new HttpException(
				'User with given Idx not found',
				HttpStatus.NOT_FOUND,
			);
		}

		const userExistsInTemp = await this.usersTempRepo.findOne({
			user: userExists,
			status: 'PENDING',
			is_obsolete: false,
		});

		if (userExistsInTemp) {
			throw new HttpException(
				'Request for user already exists',
				HttpStatus.CONFLICT,
			);
		}

		// cleanData(user, ['id', 'idx', 'is_obsolete', 'modified_on']);

		if (userRequesting.is_superadmin === true) {
			if (user.user_type) {
				user.user_type = await this.userTypeRepo.findOne({
					idx: user.user_type,
				});
			}
			const serviceBusBodyDto = {
				user: user,
				is_superadmin: true,
				idx:idx
			}
			const serviceBusDto = {
				serviceType: 'update-user-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			// invalidating user list cache as its updated

			//await this.deleteCacheWithPattern('employer');
			//await this.deleteCacheWithPattern('user');

			return { statusCode: 200, message: 'User updated' };
		}

		const userFromActive = await this.usersRepo.findOne({ idx });

		if (user.user_type) {
			user.user_type = await this.userTypeRepo.findOne({ idx: user.user_type });
		}

		const serviceBusBodyDto = {
			user: user,
			userFromActive: userFromActive,
			created_by: userRequesting.idx,
			operation: Operations.UPDATE,
			status: Status.PENDING,
			is_superadmin: false
		}
		const serviceBusDto = {
			serviceType: 'update-user-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		// invalidating pending user list cache as its updated

		// await this.deleteCacheWithPattern('employer/pending');
		// await this.deleteCacheWithPattern('puser');

		return { statusCode: 200, message: 'Request awaiting approval' };
	}

	// async createUser(user: CreateUser, userRequesting: Users): Promise<any> {
	// 	let userTypeName: string;
	// 	let userIdx: string;

	// 	const userExists = await this.usersRepo.findOne({
	// 		email: user.email,
	// 		is_obsolete: false,
	// 	});

	// 	if (userExists) {
	// 		throw new HttpException(
	// 			'Employer with given email already exists',
	// 			HttpStatus.CONFLICT,
	// 		);
	// 	}

	// 	const userTempExists = await this.usersTempRepo.findOne({
	// 		email: user.email,
	// 		status: 'PENDING',
	// 		is_obsolete: false,
	// 	});

	// 	if (userTempExists) {
	// 		throw new HttpException(
	// 			'Request with given email already exists',
	// 			HttpStatus.CONFLICT,
	// 		);
	// 	}

	// 	//	cleanData(user, ['id', 'idx', 'is_obsolete', 'modified_on', 'password']);

	// 	if (user.user_type) {
	// 		const userTypeexists = await this.userTypeRepo.findOne({
	// 			idx: user.user_type,
	// 		});

	// 		if (!userTypeexists) {
	// 			throw new HttpException(
	// 				'User type does not exists',
	// 				HttpStatus.NOT_FOUND,
	// 			);
	// 		}
	// 		user.user_type = userTypeexists;
	// 		userTypeName = userTypeexists.user_type;
	// 	}

	// 	// this handles the not null employer number

	// 	if (!user.employer_no) {
	// 		user.employer_no = new Date().toISOString();
	// 	}

	// 	if (userRequesting.is_superadmin === true) {
	// 		const serviceBusBodyDto = {
	// 			user: user,
	// 			is_superadmin: true
	// 		}
	// 		const serviceBusDto = {
	// 			serviceType: 'create-user-user-operation',
	// 			body: serviceBusBodyDto,
	// 		};
	
	// 		await this.serviceBusService.sendMessage(topicName, serviceBusDto);
	// 		return { statusCode: 200, message: 'User created' };
	// 	}

	// 	const serviceBusBodyDto = {
	// 		user: user,
	// 		status: Status.PENDING,
	// 		operation: Operations.CREATE,
	// 		created_by: userRequesting.idx,
	// 		display_id: user.employer_no,
	// 		is_superadmin: false
	// 	}
	// 	const serviceBusDto = {
	// 		serviceType: 'create-awaiting-approval-user-operation',
	// 		body: serviceBusBodyDto,
	// 	};

	// 	await this.serviceBusService.sendMessage(topicName, serviceBusDto);

	// 	return { statusCode: 200, message: 'Request awaiting approval' };
	// }

	async createUser(user: CreateUser, userRequesting: Users): Promise<any> {
		let userTypeName: string;
		let userIdx: string;

		const userExists = await this.usersRepo.findOne({
			email: user.email,
			is_obsolete: false,
		});

		if (userExists) {
			throw new HttpException(
				'Employer with given email already exists',
				HttpStatus.CONFLICT,
			);
		}

		const userTempExists = await this.usersTempRepo.findOne({
			email: user.email,
			status: 'PENDING',
			is_obsolete: false,
		});

		if (userTempExists) {
			throw new HttpException(
				'Request with given email already exists',
				HttpStatus.CONFLICT,
			);
		}

		//	cleanData(user, ['id', 'idx', 'is_obsolete', 'modified_on', 'password']);

		if (user.user_type) {
			const userTypeexists = await this.userTypeRepo.findOne({
				idx: user.user_type,
			});

			if (!userTypeexists) {
				throw new HttpException(
					'User type does not exists',
					HttpStatus.NOT_FOUND,
				);
			}
			user.user_type = userTypeexists;
			userTypeName = userTypeexists.user_type;
		}

		// this handles the not null employer number

		if (!user.employer_no) {
			user.employer_no = new Date().toISOString();
		}

		if (userRequesting.is_superadmin === true) {
			await getConnection().transaction(async transactionalEntityManager => {
				const userId: any = await transactionalEntityManager.save(Users, {
					...user,
					display_id: user.employer_no,
				});

				await transactionalEntityManager.save(CompanyUser, {
					user: userId,
				});

				// this is passed to FE

				userIdx = userId.idx;

				// possible bug with new typeorm versions

				await transactionalEntityManager.update(
					InviteEmployerLog,
					{ employer_email: user.email },
					{ status: 'ONBOARDED' },
				);

				const tokenData = jwt.sign({ data: userId.idx }, config.jwt.secret, {
					expiresIn: 300,
				});

				await transactionalEntityManager.save(EmailLog, {
					user: userId.id,
					email: user.email,
					token: tokenData,
				});

				const data = {
					link: `https://${process.env.SERVER_IP}:4070/set-password?token=${tokenData}`,
				};

				if (userTypeName === 'Default-Employer') {
					await transactionalEntityManager.save(EmployerSettings, {
						created_by: userIdx,
						auto_invite: false,
						auto_approve: false,
					});

					data.link = `https://${process.env.SERVER_IP}:4071/set-password?token=${tokenData}`;

					if (user.employer_no == '11102459') {
						await Axios.get(
							`${process.env.PAYCHEX_TIME_ATTENDENCE}/v1/paychex-integration/importCurrMonthTimeAttendance`,
						);
					}
				}

				data.link = data.link.toString();

				const serviceBusBodyDto = {
					email: user.email,
					data: data
				}
				const serviceBusDto = {
					serviceType: 'user-create-notify-user-operation',
					body: serviceBusBodyDto,
				};
		
				await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			});

			return { statusCode: 200, message: 'User created', data: { userIdx } };
		}

		await this.usersTempRepo.save({
			status: Status.PENDING,
			operation: Operations.CREATE,
			created_by: userRequesting.idx,
			display_id: user.employer_no,
			...user,
		});

		return { statusCode: 200, message: 'Request awaiting approval' };
	}

	async deleteUser(idx: string, userRequesting: Users): Promise<IResponse> {
		const userExists = await this.usersRepo.findOne({
			where: { idx, is_active: true },
			relations: ['user_type'],
		});

		if (!userExists) {
			throw new HttpException(
				'User with given Idx not found',
				HttpStatus.NOT_FOUND,
			);
		}

		const userExistsInTemp = await this.usersTempRepo.findOne({
			user: userExists,
			status: 'PENDING',
			is_obsolete: false,
		});

		if (userExistsInTemp) {
			throw new HttpException(
				'Request for user already exists',
				HttpStatus.CONFLICT,
			);
		}

		if (userRequesting.is_superadmin === true) {
			const serviceBusBodyDto = {
				idx:idx,
				is_superadmin: true
			}
			const serviceBusDto = {
				serviceType: 'delete-user-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			// invalidating pending user list cache as its updated

			// await this.deleteCacheWithPattern('employer');
			// await this.deleteCacheWithPattern('user');

			return { statusCode: 200, message: 'User deleted' };
		}
		//Check with Jenish what does the following does ????
		// EMPLOYER_TERMINATED_PAYLOAD['employer_idx'] = userExists.idx;
		// EMPLOYER_TERMINATED_PAYLOAD.data.push(
		// 	...[
		// 		{
		// 			key: 'employer_name',
		// 			value: userExists.company_name,
		// 		},
		// 	],
		// );

		// sendNotification(EMPLOYER_TERMINATED_PAYLOAD);
		const data = omit(userExists, [
			'id',
			'idx',
			'modified_on',
			'created_on',
			'is_obsolete',
			'is_active',
		]);
		const serviceBusBodyDto = {
			data: data,
			operation: Operations.DELETE,
			created_by: userRequesting.idx,
			status: Status.PENDING,
			user: userExists,
			is_superadmin: false
		}
		const serviceBusDto = {
			serviceType: 'delete-user-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		// invalidating pending user list cache as its updated

		// await this.deleteCacheWithPattern('employer/pending');
		// await this.deleteCacheWithPattern('puser');

		return { statusCode: 200, message: 'Request awaiting approval' };
	}

	async verifyUserOperation(
		approveRejectDto: ApproveRejectDto,
		idxVal: string,
		userRequesting: Users,
	): Promise<IResponse> {
		const tempUser = await this.usersTempRepo.findOne({
			where: {
				idx: idxVal,
			},
			relations: ['user_type'],
		});

		if (!tempUser) {
			throw new HttpException(
				'No user verification with the given idx',
				HttpStatus.NOT_FOUND,
			);
		}

		if (tempUser.status === 'APPROVED' || tempUser.status === 'REJECTED') {
			throw new HttpException(
				'Request already processed',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (
			tempUser.created_by === userRequesting.idx &&
			userRequesting.is_superadmin !== true
		) {
			throw new HttpException(
				'Cannot verify own request',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (approveRejectDto.status === Operations.REJECTED) {
			if (approveRejectDto.rejection_reason === '') {
				throw new HttpException(
					'Rejection reason is required',
					HttpStatus.BAD_REQUEST,
				);
			}
			const serviceBusBodyDto = {
				status: Operations.REJECTED,
				rejection_reason: approveRejectDto.rejection_reason,
				idx: idxVal
			}
			const serviceBusDto = {
				serviceType: 'verify-user-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			// invalidating pending user list cache as its updated

			// await this.deleteCacheWithPattern('employer/pending');
			// await this.deleteCacheWithPattern('puser');

			return { statusCode: 200, message: 'Request Rejected' };
		}

		const { operation } = tempUser;

		if (operation === Operations.CREATE) {
			const serviceBusBodyDto = {
				status: Operations.CREATE,
				tempUser: tempUser,
				idx: idxVal
			}
			const serviceBusDto = {
				serviceType: 'verify-user-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			
			// invalidating user list cache as its updated

			// await this.deleteCacheWithPattern('employer');
			// await this.deleteCacheWithPattern('user');

			return { statusCode: 200, message: 'Request Approved' };
		}

		if (operation === Operations.UPDATE) {
			const userResponse = await this.usersTempRepo.findOne({
				where: { idx: idxVal },
				relations: ['user_type', 'user'],
			});

			const serviceBusBodyDto = {
				status: Operations.UPDATE,
				userResponse: userResponse,
				idx: idxVal
			}
			const serviceBusDto = {
				serviceType: 'verify-user-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			// invalidating pending user list cache as its updated

			// await this.deleteCacheWithPattern('employer/pending');
			// await this.deleteCacheWithPattern('puser');

			return { statusCode: 200, message: 'Request Approved' };
		}

		if (operation === Operations.DELETE) {
			const userResponse = await this.usersTempRepo.findOne({
				where: { idx: idxVal },
				relations: ['user'],
			});

			const serviceBusBodyDto = {
				status: Operations.DELETE,
				userResponse: userResponse,
				idx: idxVal
			}
			const serviceBusDto = {
				serviceType: 'verify-user-user-operation',
				body: serviceBusBodyDto,
			};
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			// invalidating pending user list cache as its updated

			// await this.deleteCacheWithPattern('employer/pending');
			// await this.deleteCacheWithPattern('puser');

			return { statusCode: 200, message: 'Request Approved' };
		}
	}

	async enableDisable(
		operation: string,
		idx: string,
		userRequesting: Users,
	): Promise<IResponse> {
		const user = await this.usersRepo.findOne({
			where: {
				idx,
				is_obsolete: false,
			},
			relations: ['user_type'],
		});

		if (!user) {
			throw new HttpException(
				'No user with the given idx',
				HttpStatus.NOT_FOUND,
			);
		}
		const userExistsInTemp = await this.usersTempRepo.findOne({
			user: user,
			status: 'PENDING',
			is_obsolete: false,
		});

		if (userExistsInTemp) {
			throw new HttpException(
				'Request for user already exists',
				HttpStatus.CONFLICT,
			);
		}

		if (!user.is_active && operation === 'DISABLE') {
			throw new HttpException('User already disabled', HttpStatus.BAD_REQUEST);
		}

		if (user.is_active && operation === 'ENABLE') {
			throw new HttpException('User already enabled', HttpStatus.BAD_REQUEST);
		}

		if (userRequesting.is_superadmin === true) {
			const serviceBusBodyDto = {
				idx: idx,
				is_superadmin: true
			}
			const serviceBusDto = {
				serviceType: 'enable-disable-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			return {
				statusCode: 200,
				message: `The user was ${operation.toLowerCase()}d`,
			};
		}
		const id = Object.assign({}, user);
		const serviceBusBodyDto = {
			status: Status.PENDING,
			id: id,
			user: user,
			operation: operation,
			is_superadmin: false
		}
		const serviceBusDto = {
			serviceType: 'enable-disable-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		return {
			statusCode: 200,
			message: `Request awaiting approval`,
		};
	}

	/**
	 *
	 *
	 * @param {string} idx
	 * @param {string} employer_id
	 * @return {*}  {Promise<any>}
	 */
	 async calculateWage(idx: string, employer_id: string): Promise<any> {
		const customer = await this.customerRepository.findOne({
			where: {
				idx,
				is_obsolete: false,
				is_active: true,
			},
		});

		if (!customer) {
			throw new HttpException(
				'No customer found with the idx',
				HttpStatus.NOT_FOUND,
			);
		}

		let response = null;

		try {
			response = await Axios.get(
				`${process.env.GET_EMPLOYER_POLICY}${employer_id}/sa-policy/detail/`,
			);
		} catch (e) {
			console.warn(e);
			throw new HttpException(e.response.data, e.response.status);
		}

		const {
			startCycleDate: startDate,
			endCycleDate: endDate,
		} = await determinePayCycleDateRange(
			customer.pay_frequency,
			customer.employer_id,
		);

		const workLog = await this.workLogRepo.find({
			where: {
				user: customer,
				created_on: Between(
					startOfDay(new Date(startDate)).toISOString(),
					endOfDay(new Date(endDate)).toISOString(),
				),
			},
		});

		let totalWorkingdays =
			differenceInDays(new Date(endDate), new Date(startDate)) + 1;

		if (customer.pay_frequency === 'BI_WEEKLY') {
			totalWorkingdays = 10;
		}

		if (workLog.length === 0) {
			return {
				totalEarnedAmount: 0,
				available: 0,
				workedDays: 0,
				hoursWorked:
					customer.salary_type === SalaryType.HOURLY ? 0 : undefined,
				salary_type: customer.salary_type,
				totalWorkingdays,
			};
		}

		let totalHours = 0;

		for (const el of workLog) {
			totalHours += el.hours_worked;
		}

		let days = workLog.length;

		if (customer.pay_frequency === 'BI_WEEKLY') {
			if (workLog.length > 5 && workLog.length < 9) {
				days = workLog.length - 3;
			} else if (workLog.length >= 9) {
				days = 5 + (workLog.length - 8);
				if (days > 10) {
					days = 10;
				}
			}
		}

		let totalEarnedAmount = 0.0;

		// const basePayRate = await getConnection().query(
		// 	'select *  from "dbo".SaBasepayRate where employee_type = @0',
		// 	[customer.salary_type],
		// );

		if (customer.salary_type === SalaryType.HOURLY) {
			workLog.map(log => {
				totalEarnedAmount =
					totalEarnedAmount +
					parseFloat(log.pay_rate) * parseFloat(log.pay_rate);
			});
		} else {
			workLog.map(log => {
				const grossDailyPay = calculateGrossDailyPay(
					parseFloat(log.pay_rate),
					customer.pay_frequency,
				);

				totalEarnedAmount = totalEarnedAmount + grossDailyPay;
			});
		}
		const available =
			totalEarnedAmount *
			parseFloat(response.data.max_percent_of_salary) *
			0.01;

		return {
			totalEarnedAmount,
			available,
			hoursWorked:
				customer.salary_type === SalaryType.HOURLY
					? totalHours
					: undefined,
			workedDays: workLog.length,
			salary_type: customer.salary_type,
			totalWorkingdays,
		};
	}

	/**
	 *
	 *
	 * @param {string} idx
	 * @return {*}
	 * @memberof UserOperationService
	 */
	 async employeeStatus(
		idx: string,
	): Promise<{
		sa_status: string;
		is_bank_set: boolean;
		is_mobile_set: boolean;
		is_mpin_set: boolean;
		is_debitcard: boolean;
		mobile_number: string;
	}> {
		const customer = await this.customerRepository.findOne({
			where: {
				idx,
				is_obsolete: false,
			},
		});

		if (!customer) {
			throw new HttpException(
				'No customer found with the idx',
				HttpStatus.NOT_FOUND,
			);
		}

		const is_mobile_set =
			customer.mobile_number === null || customer.mobile_number === ''
				? false
				: true;

		return {
			sa_status: customer.sa_status,
			is_bank_set: customer.is_bank_set,
			is_mobile_set,
			is_debitcard: customer.is_debitcard,
			mobile_number: customer.mobile_number,
			is_mpin_set: customer.is_mpin_set,
		};
	}

	/**
	 *
	 *
	 * @param {Customer} employee
	 * @return {*}  {Promise<any>}
	 * @memberof UserOperationService
	 */
	 async hoursWorked(employee: Customer): Promise<any> {
		let response = null;

		try {
			response = await Axios.get(
				`${process.env.GET_EMPLOYER_POLICY}${employee.employer_id}/sa-policy/detail/`,
			);
		} catch (e) {
			if (e.response) {
				throw new HttpException(e.response.data, e.response.status);
			}
		}

		const workLog = await this.workLogRepo.find({
			where: {
				user: employee,
				created_on: Between(
					startOfDay(
						new Date(response.data.pay_cycle_start_on),
					).toISOString(),
					endOfDay(
						new Date(response.data.pay_cycle_end_on),
					).toISOString(),
				),
			},
		});

		if (
			workLog.length === 0 &&
			employee.salary_type === SalaryType.SALARIED
		) {
			return { totalWorked: 0, unit: 'days' };
		}

		if (
			workLog.length === 0 &&
			employee.salary_type === SalaryType.HOURLY
		) {
			return { totalWorked: '0 hours', unit: 'hours' };
		}

		if (employee.salary_type === SalaryType.SALARIED) {
			return { totalWorked: workLog.length, unit: 'days' };
		}

		let totalHours = 0;

		for (const el of workLog) {
			totalHours += el.hours_worked;
		}

		return { totalWorked: totalHours, unit: 'hours' };
	}

	/**
	 *
	 *
	 * @param {IdEmployeeDto} idEmployee
	 * @return {*}  {Promise<{ statusCode: number; data: any }>}
	 * @memberof UserOperationService
	 */
	 async idEmployee(
		idEmployee: IdEmployeeDto,
	): Promise<{ statusCode: number; data: any }> {
		const employee = await getConnection()
			.createQueryBuilder(Customer, 'Customer')
			.where(
				`	employee_id = :employee_id AND employer_id = :employer_id AND ssn_no LIKE :ssn_no `,
				{
					employee_id: idEmployee.employee_id,
					employer_id: idEmployee.employer_id,
					ssn_no: `%${idEmployee.ssn_no}`,
				},
			)
			.getOne();

		if (!employee) {
			throw new HttpException(
				`We have not found any records that match your details. Please get in touch with your employer and try to confirm your employee number.\n\nYou can also try and find this in your payslip.`,
				HttpStatus.NOT_FOUND,
			);
		}

		let contact_name = `${employee.first_name} ${employee.middle_name} ${employee.last_name}`;

		if (employee.middle_name || employee.middle_name !== ' ') {
			contact_name = `${employee.first_name} ${employee.last_name}`;
		}

		return {
			statusCode: 201,
			data: {
				contact_name,
				idx: employee.idx,
				id: employee.employee_id,
				is_registered: employee.is_registered,
			},
		};
	}

	/**
	 *
	 *
	 * @param {CheckEmail} emailDto
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationService
	 */
	 async checkEmail(emailDto: CheckEmail): Promise<IResponse> {
		const checkEmailExists = await this.customerRepository.findOne({
			where: {
				email: emailDto.email,
				is_registered: true,
				is_obsolete: false,
			},
		});

		if (checkEmailExists) {
			throw new HttpException(
				'Employee with email already registered',
				HttpStatus.CONFLICT,
			);
		}

		return {
			statusCode: 200,
			message: 'Email looks good',
		};
	}

	/**
	 *
	 *
	 * @param {string} idx
	 * @return {*}  {Promise<Customer>}
	 * @memberof UserOperationService
	 */
	 async getAllCustomerByIdx(idx: string): Promise<Customer> {
		// let res = await this.cacheManager.get<any>('employee ' + idx);

		// if (!res) {
			let res = await this.customerRepository.findOne({
				where: { idx, is_obsolete: false },
				relations: ['plaid_infos', 'card_infos'],
			});

			if (!res) {
				throw new HttpException(
					'Employee with Idx not found',
					HttpStatus.NOT_FOUND,
				);
			}

		// 	this.cacheManager.set('employee ' + idx, res, { ttl: 600 });
		// }

		return res;
	}

	/**
	 *
	 *
	 * @param {string} idx
	 * @param {string} fcm_key
	 * @param {string} platform
	 * @return {*}
	 * @memberof UserOperationService
	 */
	 async setFcm(
		idx: string,
		fcm_key: string,
		platform: string,
	): Promise<IResponse> {
		const serviceBusBodyDto = {
			idx: idx,
			fcm_key: fcm_key,
			platform: platform
		}
		const serviceBusDto = {
			serviceType: 'set-fcm-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		// await this.cacheManager.reset();

		return { statusCode: 201, message: 'Operation successful' };
	}

	/**
	 *
	 *
	 * @param {string} idx
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationService
	 */
	 async requestSaFeature(idx: string): Promise<IResponse> {
		const customer = await this.customerRepository.findOne({
			where: {
				idx,
			},
		});

		if (!customer) {
			throw new HttpException(
				'Customer with Idx not found',
				HttpStatus.NOT_FOUND,
			);
		}

		const serviceBusBodyDto = {
			idx: idx
		}
		const serviceBusDto = {
			serviceType: 'request-sa-feature-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);
		// await this.cacheManager.reset();

		return {
			statusCode: 200,
			message:
				'Your request has been sent. Once your company approves you’ll be able to request advances',
		};
	}

	/**
	 *
	 *
	 * @param {string} idx
	 * @param {AddOrChangeNumber} addOrChangeNumber
	 * @param {string} operation
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationService
	 */
	 async addorChangeMobileNumber(
		idx: string,
		addOrChangeNumber: AddOrChangeNumber,
		operation: string,
	): Promise<IResponse> {
		const checkNumber = await this.customerRepository.findOne({
			where: {
				mobile_number: addOrChangeNumber.mobile_number,
				is_active: true,
				is_obsolete: false,
			},
		});

		if (checkNumber) {
			throw new HttpException(
				'Mobile number already exists',
				HttpStatus.BAD_REQUEST,
			);
		}

		const serviceBusBodyDto = {
			idx: idx,
			mobile_number: addOrChangeNumber.mobile_number
		}
		const serviceBusDto = {
			serviceType: 'add-change-mobile-number-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		// await this.cacheManager.reset();

		return {
			statusCode: 201,
			message: `The phone number was ${
				operation === 'ADD_NUMBER' ? 'added' : 'changed'
			}`,
		};
	}

	/**
	 *
	 *
	 * @param {Customer} employee
	 * @return {*}  {Promise<IResponse>}
	 * @memberof UserOperationService
	 */
	 async resetUser(employee: Customer): Promise<IResponse> {
		const serviceBusBodyDto = {
			idx: employee.idx,
		}
		const serviceBusDto = {
			serviceType: 'reset-user-user-operation',
			body: serviceBusBodyDto,
		};

		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		return { statusCode: 200, message: 'Operation successful' };
	}

	//service related to usertype
	async getAllUserType(
		listUserType: ListActiveUserTypeDto,
	): Promise<Ipagination> {
		const { limit, search, page } = listUserType;
		const offset = limit * (page - 1);

		const query = getConnection()
			.getRepository(UserType)
			.createQueryBuilder('UserType')
			.where('UserType.is_active = :active', {
				active: true,
			})
			.andWhere('UserType.is_obsolete = :is_obsolete', {
				is_obsolete: false,
			})
			.leftJoinAndSelect('UserType.permissionsUserType', 'permissions');

		if (search !== '') {
			query.andWhere(
				new Brackets(qb => {
					qb.where(`UserType.user_type LIKE UPPER(:search)`, {
						search: `${search.toUpperCase()}%`,
					});
				}),
			);
		}

		const [result, total] = await query
			.take(limit)
			.skip(offset)
			.getManyAndCount();

		const pages = Math.ceil(total / limit);
		const host = getHost() + 'usertype/';

		return paginate(pages, page, total, host, result);
	}

	async getAllPendingUserType(
		listpendingDto: ListPendingDto,
		userRequesting: Users,
	): Promise<Ipagination> {
		const { limit, page, request_type, search } = listpendingDto;
		const offset = limit * (page - 1);

		const query = getConnection()
			.getRepository(UserTypeTemp)
			.createQueryBuilder('UserTypeTemp')
			.where('UserTypeTemp.status = :status', {
				status: Status.PENDING,
			})
			.andWhere('UserTypeTemp.is_obsolete = :is_obsolete', {
				is_obsolete: false,
			});

		if (request_type === 'by') {
			query.andWhere('UserTypeTemp.created_by = :idx', {
				idx: userRequesting.idx,
			});
		}
		if (request_type === 'to') {
			query.andWhere('UserTypeTemp.created_by != :idx', {
				idx: userRequesting.idx,
			});
		}

		if (search !== '') {
			query.andWhere(
				new Brackets(qb => {
					qb.where(`UserTypeTemp.user_type LIKE UPPER(:search)`, {
						search: `${search.toUpperCase()}%`,
					});
				}),
			);
		}

		const [result, total] = await query
			.take(limit)
			.skip(offset)
			.getManyAndCount();

		const pages = Math.ceil(total / limit);
		const host = getHost() +'usertype/pending/';

		return paginate(pages, page, total, host, result);
	}

	async getPendingUserTypeByIdx(idx: string) {
		const userTypeFromTemp = await this.userTypeTempRepo.findOne({
			where: { idx, is_obsolete: false, status: Status.PENDING },
			relations: ['permissionUserTypeTemps', 'userType'],
		});

		console.info(userTypeFromTemp);
		if (!userTypeFromTemp) {
			throw new HttpException(
				'UserType with Idx not found',
				HttpStatus.NOT_FOUND,
			);
		}

		const userType = await this.userTypeRepo.findOne({
			where: {
				id: userTypeFromTemp?.userType?.id,
			},
			relations: ['permissionsUserType'],
		});

		return {
			new_userType: classToPlain(userTypeFromTemp),
			current_userType: classToPlain(userType),
		};
	}

	async getAUserType(idx: string): Promise<unknown> {
		const checkUserTypeExists = await this.userTypeRepo.findOne(
			{ idx, is_obsolete: false },
			{
				select: ['id', 'idx', 'created_on', 'user_type', 'is_active'],
			},
		);

		if (!checkUserTypeExists) {
			throw new HttpException('User type not found', HttpStatus.NOT_FOUND);
		}

		const permission = await getConnection().query(
			`select dbo."Permission".idx, dbo."Permission".base_name,dbo."Permission".url,dbo."Permission".method from dbo."Permission" join dbo."PermissionUserType" on "Permission".id = "PermissionUserType".permission_id where "PermissionUserType".user_type = @0`,
			[checkUserTypeExists.id],
		);

		return { ...omit(checkUserTypeExists, ['id']), permission };
	}
	async createUsertype(
		dto: CreateUserType,
		userRequesting: Users,
	): Promise<response> {
		const userTypeExists = await this.userTypeRepo.findOne({
			user_type: dto.user_type,
			is_obsolete: false,
		});

		if (userTypeExists) {
			throw new HttpException(
				'User type with given name already exists',
				HttpStatus.CONFLICT,
			);
		}

		const incomingPermissions = await this.permissionRepo.find({
			where: { idx: In(dto.permission) },
			select: ['id', 'base_name'],
		});

		if (userRequesting.is_superadmin === true) {
			await getConnection().transaction(async transactionalEntityManager => {
				const userType = new UserType(dto.user_type, dto.description);

				const userId = await transactionalEntityManager.save(
					UserType,
					userType,
				);

				const permissionBulkAdd = [];

				for (const element of incomingPermissions) {
					const permission = new PermissionUserType();

					permission.idx = element.idx;
					permission.userType = userId;
					permission.base_name = element.base_name;
					permission.permission = element;
					permissionBulkAdd.push(permission);
				}

				// await transactionalEntityManager.save(
				// 	PermissionUserType,
				// 	permissionBulkAdd,
				// );
				const serviceBusBodyDto = {
					permissionBulkAdd: permissionBulkAdd,
					createUserTypeTemplate:"Add"
				}

				const serviceBusDto = {
					serviceType: 'create-usertype-user-operation',
					body: serviceBusBodyDto,
					
				};
		
				await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			});


			return { statusCode: 200, message: 'User type Added' };
		}
		dto.operation = Operations.CREATE;
		dto.created_by = userRequesting.idx;
		dto.status = Status.PENDING;
		
		const serviceBusBodyDto = {
			dto:dto ,
			createUserTypeTemplate:"Request"
		}

		const serviceBusDto = {
			serviceType: 'create-usertype-user-operation',
			body: serviceBusBodyDto,
			
		};
		await this.serviceBusService.sendMessage(topicName, serviceBusDto);
		return { statusCode: 200, message: 'Request awaiting approval' };
	}

	async deleteUserType(idx: string, userRequesting: Users): Promise<response> {
		const checkUserTypeExists = await this.userTypeRepo.findOne({
			where: { idx, is_obsolete: false },
		});

		if (!checkUserTypeExists) {
			throw new HttpException('User type not found', HttpStatus.NOT_FOUND);
		}
		if (checkUserTypeExists.user_type.includes('Default')) {
			throw new HttpException(
				'Default usertype cannot be deleted',
				HttpStatus.FORBIDDEN,
			);
		}
		if (userRequesting.is_superadmin === true) {
			const serviceBusBodyDto = {
				idx:idx ,
				is_obsolete:true,
				action:"update"
			}
	
			const serviceBusDto = {
				serviceType: 'delete-usertype-user-operation',
				body: serviceBusBodyDto,
				
			};
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			return {
				statusCode: 200,
				message: 'User type Deleted',
			};
		}

		const userType = await this.userTypeRepo.findOne({
			idx,
		});

		const serviceBusBodyDto = {
			user_type: userType.user_type,
			description: userType.description,
			status: Status.PENDING,
			operation: Operations.DELETE,
			userType: userType,
			created_by: userRequesting.idx,
			action:"save"
		}

		const serviceBusDto = {
			serviceType: 'delete-usertype-user-operation',
			body: serviceBusBodyDto,
		};
		await this.serviceBusService.sendMessage(topicName, serviceBusDto);

		return { statusCode: 200, message: 'Request awaiting approval' };
	}

	async updateUserTypeName(
		userType: UpdateUserTypeName,
		idx: string,
		userRequesting: Users,
	): Promise<response> {
		const checkUserTypeExists = await this.userTypeRepo.findOne({
			idx,
			is_obsolete: false,
		});

		if (!checkUserTypeExists) {
			throw new HttpException('User type not found', HttpStatus.NOT_FOUND);
		}

		const userTypeNameExistsInActive = await this.userTypeRepo.findOne({
			user_type: userType.user_type,
			idx: Not(idx),
		});

		if (userTypeNameExistsInActive) {
			throw new HttpException(
				'User type with given name already exists',
				HttpStatus.CONFLICT,
			);
		}

		if (userRequesting.is_superadmin === true) {
			
			const serviceBusBodyDto = {
				user_type:userType.user_type ,
				description: userType.description,
				idx:idx,
				action:"update"
			}
	
			const serviceBusDto = {
				serviceType: 'upadte-usertype-name-user-operation',
				body: serviceBusBodyDto,
				
			};
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			return { statusCode: 200, message: 'Updated user type name' };
		}
		const userTypeFromIdx = await this.userTypeRepo.findOne({ idx });

		console.info(userTypeFromIdx);

		const serviceBusBodyDto = {
			userType: userTypeFromIdx,
			operation: Operations.UPDATE_USERTYPE_NAME,
			status: Status.PENDING,
			user_type: userType.user_type,
			description: userType.description,
			created_by: userRequesting.idx,
			action:"save"
		}

		const serviceBusDto = {
			serviceType: 'upadte-usertype-name-user-operation',
			body: serviceBusBodyDto,
			
		};
		await this.serviceBusService.sendMessage(topicName, serviceBusDto);


		return { statusCode: 200, message: 'Request awaiting approval' };
	}

	async VerifyUserType(
		merchantData: ApproveRejectDto,
		idxVal: string,
		userRequesting: Users,
	) {
		const tempUserType = await this.userTypeTempRepo.findOne({
			where: {
				idx: idxVal,
			},
		});

		if (!tempUserType) {
			throw new HttpException(
				'No usertype verification with the given idx',
				HttpStatus.NOT_FOUND,
			);
		}

		if (
			tempUserType.status === 'APPROVED' ||
			tempUserType.status === 'REJECTED'
		) {
			throw new HttpException(
				'Request already processed',
				HttpStatus.BAD_REQUEST,
			);
		}

		if (
			tempUserType.created_by === userRequesting.idx &&
			userRequesting.is_superadmin !== true
		) {
			throw new HttpException(
				'Cannot verify own request',
				HttpStatus.BAD_REQUEST,
			);
		}
		if (merchantData.status === Status.REJECTED) {
			if (
				!merchantData.rejection_reason ||
				merchantData.rejection_reason === ''
			) {
				throw new HttpException(
					'Rejection reason is required',
					HttpStatus.BAD_REQUEST,
				);
			}


			const serviceBusBodyDto = {
				status: Operations.REJECTED,
				idx: idxVal,
				type:"rejected"
			}
			const serviceBusDto = {
				serviceType: 'verify-user-type-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			return { statusCode: 200, message: 'Request Rejected' };
		}
		const { operation, ...tempData }: any = await this.userTypeTempRepo.findOne(
			{
				where: { idx: idxVal },
				relations: ['userType'],
			},
		);

		if (operation === Operations.CREATE) {
			
			const serviceBusBodyDto = {
				tempData: tempData,
				idx: idxVal,
				type:"create"
			}
			const serviceBusDto = {
				serviceType: 'verify-user-type-user-operation',
				body: serviceBusBodyDto,
			};
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			return { statusCode: 200, message: 'Request Approved' };
		}

		if (operation === Operations.UPDATE_USERTYPE_NAME) {


			const serviceBusBodyDto = {
				tempData: tempData,
				idx: idxVal,
				type:"updateUserType"
			}
			const serviceBusDto = {
				serviceType: 'verify-user-type-user-operation',
				body: serviceBusBodyDto,
			};
			
	
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);


			

			return { statusCode: 200, message: 'Request Approved' };
		}

		if (operation === Operations.UPDATE_USERTYPE_PERMISSIONS) {
			const { id, userType } = tempData;
			const serviceBusBodyDto = {
				tempData: tempData,
				userType: userType,
				id:id,
				idxVal: idxVal,
				type:"updateUserTypePermission"
			}
			const serviceBusDto = {
				serviceType: 'verify-user-type-user-operation',
				body: serviceBusBodyDto,
			};
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);
			return { statusCode: 200, message: 'Request Approved' };
		}

		if (operation === Operations.DELETE) {
			const tempRole = await this.userTypeTempRepo.findOne({
				where: {
					idx: idxVal,
				},
				relations: ['userType'],
			});

			
			const serviceBusBodyDto = {
				id:tempRole.userType.id,
				idxVal:idxVal,
				type:"delete"
			}
			const serviceBusDto = {
				serviceType: 'verify-user-type-user-operation',
				body: serviceBusBodyDto,
			};
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);


			return { statusCode: 200, message: 'Request Approved' };
		}
	}

	async CheckPermissionExists(
		permissionArray: Array<string>,
	): Promise<boolean> {
		const permissions = await this.permissionRepo.find({
			where: { idx: In(permissionArray) },
		});

		if (permissions?.length == permissionArray?.length) {
			return true;
		}

		return false;
	}
	async updateUserTypePermissions(
		userType: UpdateUserTypePermissions,
		idx: string,
		userRequesting: Users,
	): Promise<response> {
		const checkUserTypeExists = await this.userTypeRepo.findOne({
			idx,
			is_obsolete: false,
		});

		if (!checkUserTypeExists) {
			throw new HttpException('Usertype not found', HttpStatus.NOT_FOUND);
		}

		const permissionExists = await this.CheckPermissionExists(
			userType.permission,
		);

		if (!permissionExists) {
			throw new HttpException(
				'Some permissions are invalid',
				HttpStatus.BAD_REQUEST,
			);
		}

		const incomingPermissions = await this.permissionRepo.find({
			where: { idx: In(userType.permission) },
			select: ['id', 'base_name'],
		});

		if (userRequesting.is_superadmin === true) {

			const serviceBusBodyDto = {
				checkUserTypeExists:checkUserTypeExists,
				incomingPermissions:incomingPermissions,
				userType:userType,
				type:"superadmin"
			}
			const serviceBusDto = {
				serviceType: 'update-user-type-user-operation',
				body: serviceBusBodyDto,
			};
			await this.serviceBusService.sendMessage(topicName, serviceBusDto);

			return { statusCode: 200, message: 'Updated user type permissions' };
		}

		const serviceBusBodyDto = {
			user_type: checkUserTypeExists.user_type,
			userType: checkUserTypeExists,
			operation: Operations.UPDATE_USERTYPE_PERMISSIONS,
			status: Status.PENDING,
			description: checkUserTypeExists.description,
			created_by: userRequesting.idx,
			incomingPermissions:incomingPermissions
		}
		const serviceBusDto = {
			serviceType: 'update-user-type-user-operation',
			body: serviceBusBodyDto,
		};
		await this.serviceBusService.sendMessage(topicName, serviceBusDto);
		return { statusCode: 200, message: 'Request awaiting approval' };
	}

}


