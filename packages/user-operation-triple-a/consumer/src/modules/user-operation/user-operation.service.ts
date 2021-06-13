import { Operations } from '@common/constants/mapping/Operations.enum';
import { Permission } from '@entities/Permission';
import { PermissionUserTypeTemp } from '@entities/PermissionUserTypeTemp';
import axios from 'axios';
import * as https from 'https';
import {
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@common/constants/Status.enum';
import { Customer } from '@entities/Customer.entity';
import { EmailLog } from '@entities/EmailLog';
import { InviteEmployerLog } from '@entities/InviteEmployerLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog';
import { WrongUserLog } from '@entities/WrongUserLog';
import { Users } from '@entities/Users';
import { UsersTemp } from '@entities/UsersTemp';
import { UserType } from '@entities/UserType';
import { CompanyUser } from '@entities/CompanyUser';
import { omit, removeEmpty} from '@rubiin/js-utils';
import * as jwt from 'jsonwebtoken';
import config from '@config/index';
import { AvailableProviders } from '@common/constants/mapping/providers.enum';
import { PermissionUserType } from '@entities/PermissionUserType';
import {
	sendMailUser,

} from '@utils/helpers'
import { EmployerSettings } from '@entities/EmployerSettings.entity';
import {Repository, getConnection,getManager,In} from 'typeorm';
import { UserTypeTemp } from '@entities/UserTypeTemp';


const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
const logger = new Logger('Create Employee Login DB Writer');

@Injectable()
export class UserOperationService {
  constructor(
	@InjectRepository(PermissionUserType)
	private readonly permissionUserTypeRepo: Repository<PermissionUserType>,
	@InjectRepository(UsersTemp)
		private readonly usersTempRepo: Repository<UsersTemp>,
	@InjectRepository(InviteEmployerLog)
		private readonly inviteEmployerRepo: Repository<InviteEmployerLog>,
	@InjectRepository(WrongUserLog)
		private readonly wrongUserLogRepo: Repository<WrongUserLog>,
	@InjectRepository(Users)
	private readonly usersRepo: Repository<Users>,
    @InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
	@InjectRepository(UserType)
		private readonly userTypeRepo: Repository<UserType>,
	@InjectRepository(UserTypeTemp)
		private readonly userTypeTempRepo: Repository<UserTypeTemp>,
	@InjectRepository(Permission)
		private readonly permissionRepo: Repository<Permission>,
	@InjectRepository(PermissionUserTypeTemp)
		private readonly permissionUserTypeTemp: Repository<PermissionUserTypeTemp>,
  ) {
  }
  /**
   *
   * @param {EmployerLoginDto} emplLogin- Employee login Dto
   * @return {Promise<any>} - Returns Promise of Object
   */  	
	async wrongUserFound(
		data:any
		): Promise<any> {
		try{
			await sendMailUser(
				'Orbis',
				'aaja.baruwal@orbispay.me',
				'notify',
				{
					employer:
						'The employee with email ' +
						data.employee_email +
						' has trouble signing in',
				},
				'Alert',
			);
	
			await this.wrongUserLogRepo.save({ ...data, status: 'PENDING' });
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async contactMe(
		data:any
		): Promise<any> {
		try{
			const inviteEmployer = new InviteEmployerLog();
			inviteEmployer.employer_email = data.email;
			await this.inviteEmployerRepo.save(inviteEmployer);
			const mailData = {
				email: data.email,
			};
			await sendMailUser(
				'Orbis',
				'aaja.baruwal@orbispay.me',
				'contact',
				mailData,
				'Employer contact request',
			);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}



	}

	async sendUserCreateNotification (data:any
		): Promise<any> {
		try {
			await sendMailUser(
				'Orbis',
				data.email,
				'welcome',
				data.data,
				'Welcome to OrbisPay!',
			);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	getAxios() {
		return axios.create({
		  httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		  }),
		});
	  }
	

	async invitemeployerMobile(
		data:any
		): Promise<any> {
		try{
			const inviteEmployer = new InviteEmployerLog();
			inviteEmployer.employee_email = data.employee_email;
			inviteEmployer.employer_email = data.employer_email;
			await sendMailUser(
				'Orbis',
				'aaja.baruwal@orbispay.me',
				'notify',
				{
					employer:
						'The employee with email ' +
						data.employee_email +
						' has ivited and employer with email ' +
						data.employer_email,
				},
				'Alert',
			);
			await this.inviteEmployerRepo.save(inviteEmployer);

		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async setNotification(
		data:any
		): Promise<any> {
		try{
			await this.inviteEmployerRepo.update(
				{ employer_email: data.employer_email },
				{ notify: data.notify },
			);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
	async updateUser(
		data:any
		): Promise<any> {
		try{
			if (data.is_superadmin === true) {
				if (data.user.user_type) {
					data.user.user_type = await this.userTypeRepo.findOne({
						idx: data.user.user_type.idx,
					});
				}
				const idx = data.idx;
				await this.usersRepo.update({ idx }, data.user);
				// invalidating user list cache as its updated

				
			}
			else{
				await this.usersTempRepo.save({
					user: data.userFromActive,
					created_by: data.created_by,
					operation: Operations.UPDATE,
					status: Status.PENDING,
					...data.user,
				});
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async createUser(
		data:any
		): Promise<any> {
			let userTypeName: string;
			let userIdx: string;
			let serviceBusDto = {};
			let paramData = data
			const Axios = this.getAxios();
		try{
			
				await getConnection().transaction(async transactionalEntityManager => {
					const userId: any = await transactionalEntityManager.save(Users, {
						...paramData.data,
						display_id: paramData.employer_no,
					});
	
					await transactionalEntityManager.save(CompanyUser, {
						user: userId,
					});
	
					// this is passed to FE
	
					userIdx = userId.idx;
	
					// possible bug with new typeorm versions
	
					await transactionalEntityManager.update(
						InviteEmployerLog,
						{ employer_email: paramData.user.email },
						{ status: 'ONBOARDED' },
					);
	
					const tokenData = jwt.sign({ data: userId.idx }, config.jwt.secret, {
						expiresIn: config.jwt.access_expiry
					});
	
					await transactionalEntityManager.save(EmailLog, {
						user: userId.id,
						email: paramData.user.email,
						token: tokenData,
					});
	
					// invalidating user list cache as its updated
	
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
	
						if (paramData.user.employer_no == '11102459') {
							await Axios.get(
								`${process.env.PAYCHEX_TIME_ATTENDENCE}/v1/paychex-integration/importCurrMonthTimeAttendance`,
							);
						}
					}
	
					data.link = data.link.toString();
	
					await sendMailUser(
						'Orbis',
						paramData.user.email,
						'welcome',
						data,
						'Welcome to OrbisPay!',
					);
				});
				// serviceBusDto = {

				// 	body: {
				// 		userIdx:userIdx,
				// 		is_active: true,
				// 		status: Status.PENDING,
				// 	},
				// };
				// return serviceBusDto;
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
	async createAwaitUser(
		data:any
		): Promise<any> {
		try{
			console.log('Data from Create await User --------> ' + JSON.stringify(data));
			await this.usersTempRepo.save({
				status: Status.PENDING,
				operation: Operations.CREATE,
				created_by: data.idx,
				display_id: data.user.employer_no,
				...data.user,
			});
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async deleteUser(
		data:any
		): Promise<any> {
		try{
			let idx = data.idx
			if (data.is_superadmin === true) {
				await this.usersRepo.update({ idx }, { is_obsolete: true });
			}
			else{
				await this.usersTempRepo.save({
					...data,
					operation: Operations.DELETE,
					created_by: data.idx,
					status: Status.PENDING,
					user: data.user,
				});
		
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async verifyUserOperation(
		data:any
		): Promise<any> {
		const Axios = this.getAxios();
		try{
			if (data.status === Status.REJECTED) {
				if (data.rejection_reason === '') {
					throw new HttpException(
						'Rejection reason is required',
						HttpStatus.BAD_REQUEST,
					);
				}
	
				await this.usersTempRepo.update(
					{ idx: data.idx },
					{
						status: Status.REJECTED,
						rejection_reason: data.rejection_reason,
					},
				);
			}
			if (data.status === Operations.CREATE) {
				let tempUser = data.tempUser
				await getConnection().transaction(async transactionalEntityManager => {
					const user: any = await transactionalEntityManager.save(Users, {
						company_name: tempUser.company_name,
						contact_name: tempUser.contact_name,
						zip_code: tempUser.zip_code,
						payroll_system: AvailableProviders[`${tempUser.payroll_system}`],
						user_type: tempUser.user_type,
						phone_ext: tempUser.phone_ext,
						phone_number: tempUser.phone_number,
						display_id: tempUser.display_id,
						employer_no: tempUser.employer_no,
						email: tempUser.email,
						company_internalhr_system: tempUser.company_internalhr_system,
						time_management_system: tempUser.time_management_system,
						// receive_signed_agreement: tempUser.receive_signed_agreement,
						// receive_questionare_form: tempUser.receive_questionare_form,
					});
	
					await transactionalEntityManager.save(CompanyUser, {
						user,
						is_obsolete: false,
					});
	
					await transactionalEntityManager.save(PasswordHistoryLog, {
						password: tempUser.password,
						user_id: user,
					});
	
					const token = jwt.sign({ data: user.idx }, config.jwt.secret, {
						expiresIn: config.jwt.access_expiry
					});
	
					await transactionalEntityManager.save(EmailLog, {
						user: user,
						email: tempUser.email,
						token,
					});
	
					const mailData = {
						link: `https://${process.env.SERVER_IP}:4070/set-password?token=${token}`,
					};
	
					if (tempUser.user_type.user_type === 'Default-Employer') {
						mailData.link = `https://${process.env.SERVER_IP}:4071/set-password?token=${token}`;
						if (user.employer_no == '11102459') {
				await Axios.get(
				  `${process.env.PAYCHEX_TIME_ATTENDENCE}/v1/paychex-integration/importCurrMonthTimeAttendance`,
				);
						}
					}
	
					await transactionalEntityManager.update(
						UsersTemp,
						{ idx: data.idx },
						{ status: Status.APPROVED, user },
					);
					//Ask doubt to Jenish
	
					// EMPLOYER_ADDED_PAYLOAD['employer_idx'] = user.idx;
					// EMPLOYER_ADDED_PAYLOAD.data.push(
					// 	...[
					// 		{
					// 			key: 'employer_name',
					// 			value: user.company_name,
					// 		},
					// 	],
					// );
					// await sendNotification(EMPLOYER_ADDED_PAYLOAD);
	
					await sendMailUser(
						'Orbis',
						tempUser.email,
						'welcome',
						mailData,
						'Welcome to OrbisPay!',
					);
				});
			}
			if (data.status === Operations.UPDATE) {
				
	
				// filtering out data not in UserProfile
	
				const { user }: any = data.userResponse;
	
				await getConnection().transaction(async transactionalEntityManager => {
					await transactionalEntityManager
						.getRepository(UsersTemp)
						.update({ idx: data.idx }, { status: Status.APPROVED });
	
					await transactionalEntityManager
						.getRepository(Users)
						.update(
							{ id: user.id },
							removeEmpty(
								omit(data.userResponse, [
									'idx',
									'id',
									'operation',
									'user',
									'status',
									'rejection_reason',
									'created_by',
									'is_obsolete',
									'is_active',
									'created_on',
									'modified_on',
								]),
							),
						);
				});
			}
	
			if (data.status === Operations.DELETE) {
				
	
				await getManager().transaction(async transactionalEntityManager => {
					await transactionalEntityManager
						.getRepository(UsersTemp)
						.update({ idx: data.idx }, { status: Status.APPROVED });
	
					await transactionalEntityManager
						.getRepository(Users)
						.update({ id: data.userResponse.user.id }, { is_obsolete: true });
				});
	
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async enableDisable(
		data:any
		): Promise<any> {
		try{
			if (data.is_superadmin === true) {
				var idx = data.idx;
				await this.usersRepo.update(
					{ idx },
					{ is_active: operation === 'ENABLE' },
				);
			}
			else{
				var operation = data.operation;
				const user = data.user;
				const id = Object.assign({}, user);
				await this.usersTempRepo.save({
					user: data.id,
					...user,
					status: Status.PENDING,
					operation,
					created_by: user.idx,
			});
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async setFcm(
		data:any
		): Promise<any> {
		let idx = data.idx;
		let fcm_key = data.fcm_key;
		let platform = data.platform;
		try{
			await this.customerRepository.update({ idx }, { fcm_key, platform });
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
	async addorChangeMobileNumber(
		data:any
		): Promise<any> {
		let idx = data.idx;
		let mobile_number = data.mobile_number;
		try{
			
			await this.customerRepository.update(
				{ idx },
				{
					mobile_number: mobile_number,
				},
			);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
	async requestSaFeature(
		data:any
		): Promise<any> {
		let idx = data.idx;
		try{
			await this.customerRepository.update(
				{ idx },
				{ sa_status: 'PENDING', sa_approved: false, sort_order: 1 },
			);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
	async resetUser(
		data:any
		): Promise<any> {
		let idx = data.idx;
		try{
			await this.customerRepository.update(
				{ idx: idx},
				{ is_registered: false },
			);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async createUserType(
		data:any
		): Promise<any> {
		try{
			const permission = new PermissionUserType();
			if(data.createUserTypeTemplate === 'Add'){
				await getConnection().transaction(async transactionalEntityManager => {
					await transactionalEntityManager.save(
						PermissionUserType,
						data.permissionBulkAdd,
					);	
				});
			}
			else if(data.createUserTypeTemplate === 'Request'){
				await getManager().transaction(async transactionalEntityManager => {
				const roleId: any = await transactionalEntityManager
				.getRepository(UserTypeTemp)
				.save(data.dto);

				const id = roleId.id;

				const incomingPermissions = await getConnection()
					.getRepository(Permission)
					.find({
						where: { idx: In(roleId.permission) },
						select: ['id', 'base_name'],
					});

				const permissionBulkAdd = [];

				for (const element of incomingPermissions) {
					const permission = new PermissionUserTypeTemp();

					permission.idx = element.idx;
					permission.usertype = id;
					permission.base_name = element.base_name;
					permission.permission = element;

					permissionBulkAdd.push(permission);
				}

				await transactionalEntityManager
					.getRepository(PermissionUserTypeTemp)
					.save(permissionBulkAdd);
			});

			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async deleteUserType(
		data:any
		): Promise<any> {
		let idx = data.idx;
		try{
			if(data.action === 'update'){
				await this.userTypeRepo.update({ idx }, { is_obsolete: data.is_obsolete });
			}
			else if(data.action === 'save'){
				await this.userTypeTempRepo.save({
					user_type: data.user_type,
					description: data.description,
					status: data.status,
					operation: data.operation,
					userType: data.userType,
					created_by: data.created_by,
				});
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async updateUserTypeName(
		data:any
		): Promise<any> {
		let idx = data.idx;
		try{
			if(data.action === 'update'){
				await this.userTypeRepo.update(
				{ idx },
				{ user_type: data.user_type, description: data.description },
				);
			}
			else if(data.action === 'save'){
				await this.userTypeTempRepo.save({
					userType: data.userType,
					operation: data.operation,
					status: data.status,
					user_type: data.user_type,
					description: data.description,
					created_by: data.created_by,
				});
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async VerifyUserType(
		data:any
		): Promise<any> {
		try{
			if(data.type === 'rejected'){
				console.log("**************************");
				console.log("entering update");
				await this.userTypeTempRepo.update(
					{ idx: data.idx },
					{ status: Status.REJECTED },
				);
			}
			else if(data.type === 'create'){
				console.log("**************************");
				console.log("entering create");
				await getManager().transaction(async transactionalEntityManager => {
					const saveToActiveRole = await transactionalEntityManager
						.getRepository(UserType)
						.save({
							...omit(data.tempData, [
								'idx',
								'id',
								'is_obsolete',
								'is_active',
								'created_on',
								'modified_on',
							]),
						});
					const permissionBulkAdd = [];
					const permissions = await this.permissionUserTypeTemp.find({
						where: { usertype: data.tempData.id },
						relations: ['permission'],
					});
	
					for (const element of permissions) {
						const permission = new PermissionUserType();
	
						permission.userType = saveToActiveRole;
						permission.permission = element.permission;
						permission.base_name = element.base_name;
						permissionBulkAdd.push(permission);
					}
	
					await transactionalEntityManager
						.getRepository(PermissionUserType)
						.save(permissionBulkAdd);
	
					await transactionalEntityManager
						.getRepository(UserTypeTemp)
						.update(
							{ idx: data.idx },
							{ userType: saveToActiveRole, status: Status.APPROVED },
						);
				});
	
			}
			else if (data.type === 'updateUserType'){
				console.log(data);
				console.log("**************************");
				console.log("entering updateUserType");
				const roleResponse = await this.userTypeTempRepo.findOne({
					where: { idx: data.idx },
					relations: ['userType'],
				});
				console.log(roleResponse);
				const { user_type, id }: any = roleResponse;
				console.log(user_type)
				console.log(id);
				await getManager().transaction(async transactionalEntityManager => {
					await transactionalEntityManager
						.getRepository(UserTypeTemp)
						.update({ idx: data.idx }, { status: Status.APPROVED });
	
					await transactionalEntityManager
						.getRepository(UserType)
						.update({ id: id }, { user_type });
				});
	
			}
			else if(data.type === 'updateUserTypePermission'){
				console.log("**************************");
				console.log("entering updateUserTypePermission");
				const userType = data.userType;
				const tempData  = data.tempData;
				const id = data.id;
				const idxVal = data.idxVal;
				await getManager().transaction(async transactionalEntityManager => {
					await transactionalEntityManager
						.getRepository(PermissionUserType)
						.delete({ userType });
	
					await transactionalEntityManager
						.getRepository(UserType)
						.update({ idx: userType.idx }, { description: tempData.description });
	
					const permissionBulkAdd = [];
					const permissions = await this.permissionUserTypeRepo.find({
						where: { userType: id },
						relations: ['permission'],
					});
	
					for (const element of permissions) {
						const permission = new PermissionUserType();
	
						permission.userType = userType;
						permission.base_name = element.base_name;
						permission.permission = element.permission;
						permissionBulkAdd.push(permission);
					}
	
					await transactionalEntityManager
						.getRepository(PermissionUserType)
						.save(permissionBulkAdd);
	
					await transactionalEntityManager
						.getRepository(UserTypeTemp)
						.update({ idx: idxVal }, { userType, status: Status.APPROVED });
				});
			}
			else if(data.type === 'delete'){
				console.log("**************************");
				console.log("entering delete");
				const idxVal = data.idxVal;
				const id = data.id
				await getManager().transaction(async transactionalEntityManager => {
					await transactionalEntityManager
						.getRepository(UserTypeTemp)
						.update({ idx: idxVal }, { status: Status.APPROVED });
	
					await transactionalEntityManager
						.getRepository(UserType)
						.update({ id: id }, { is_obsolete: true });
				});
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}

	async updateUserTypePermissions(
		data:any
		): Promise<any> {
		const idx = data.idx;
		try{
			if(data.type === 'superadmin'){
				const checkUserTypeExists = data.checkUserTypeExists;
				const incomingPermissions = data.incomingPermissions;
				const userType = data.userType;
				await getConnection().transaction(async transactionalEntityManager => {
					await transactionalEntityManager.delete(PermissionUserType, {
						userType: checkUserTypeExists,
					});
					const permissionBulkAdd = [];
	
					for (const element of incomingPermissions) {
						const permission = new PermissionUserType();
	
						permission.idx = element.idx;
						permission.userType = checkUserTypeExists;
						permission.base_name = element.base_name;
						permission.permission = element;
						permissionBulkAdd.push(permission);
					}
	
					await transactionalEntityManager.save(permissionBulkAdd);
	
					await transactionalEntityManager.update(
						UserType,
						{ idx },
						{ description: userType.description },
					);
				});
			}
			else{
				const userTypeTempRes = await this.userTypeTempRepo.save({
					user_type: data.user_type,
					userType: data.userType,
					operation: data.operation,
					status: data.status,
					description: data.description,
					created_by: data.created_by,
				});
		
				if (data.incomingPermissions.length > 0) {
					const permissionBulkAdd = [];
		
					for (const element of data.incomingPermissions) {
						const permission = new PermissionUserTypeTemp();
		
						permission.usertype = userTypeTempRes;
						permission.permission = element;
						permission.base_name = element.base_name;
		
						permissionBulkAdd.push(permission);
					}
					await this.permissionUserTypeTemp.save(permissionBulkAdd);
				}
			}
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}


}
