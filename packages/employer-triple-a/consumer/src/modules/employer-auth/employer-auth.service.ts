import { subtractDate } from '@utils/helpers';
import {
	HttpException,
	HttpStatus,
	Injectable,
	Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@common/constants/status.enum';
import { Protocol } from '@entities/Protocol.entity';
import { ActivityLog } from '@entities/ActivityLog';
import { OtpLog } from '@entities/OtpLog';
import { EmailLog } from '@entities/EmailLog';
import { PasswordHistoryLog } from '@entities/PasswordHistoryLog'
import { Users } from '@entities/Users';
import {
	endOfDay,
	startOfDay,
} from 'date-fns';
import {
	sendMail,
} from '@utils/helpers';
import { EmployerSettings } from '@entities/EmployerSettings.entity';
import {Repository,Between, getConnection,In ,getManager} from 'typeorm';
import { UserLoginDto } from '@dtos/Derived.dto';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
const logger = new Logger('Create Employee Login DB Writer');

@Injectable()
export class EmployerAuthService {
  constructor(
	@InjectRepository(Users)
	private readonly usersRepo: Repository<Users>,
    @InjectRepository(Protocol)
		private readonly protocolRepo: Repository<Protocol>,
	@InjectRepository(ActivityLog)
		private readonly activityLogRepo: Repository<ActivityLog>,
	@InjectRepository(OtpLog)
		private readonly otpLogRepository: Repository<OtpLog>,
	@InjectRepository(EmployerSettings)
		private readonly employerSettingsRepo: Repository<EmployerSettings>,
	@InjectRepository(PasswordHistoryLog)
	private readonly passwordHistoryRepo: Repository<PasswordHistoryLog>,
  ) {}

	async loginEmployerSaveActivity(data:any): Promise<any> {
			try{
				await this.activityLogRepo.save({
					ip_address: data.ip,
					device_id: '',
					login_type: 'WEB',
					login_status: false,
					user_id: data.user,
					activity_type: 'LOGIN',
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

	async loginEmployerUpdateActivity(data:any): Promise<any> {
		try{
			const updateLog = data.id
			await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager
							.createQueryBuilder()
							.update(ActivityLog)
							.set({ is_obsolete: data.is_obsolete })
							.where({ id: In(updateLog) })
							.execute();
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
	
	async loginUpdateUserAccount(data:any): Promise<any> {
		try{
			await this.usersRepo.update({ id: data.id }, { is_active: data.is_active });
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async loginUserUpdateActivity(data:any): Promise<any> {
		try{
			let updateLog = data.id;
			await getManager().transaction(async transactionalEntityManager => {
			await transactionalEntityManager
							.createQueryBuilder()
							.update(ActivityLog)
							.set({ is_obsolete: true })
							.where({ id: In(updateLog) })
							.execute();
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

	async loginUserSaveActivity(data:any): Promise<any> {
		try{
			await this.activityLogRepo.save({
				ip_address: data.ip,
				device_id: '',
				login_type: 'WEB',
				login_status: false,
				user_id: data.user,
				activity_type: 'LOGIN',
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

  	async setPassword(
		data:any
		): Promise<any> { 

			try{
				
				await getConnection().transaction(async transactionalEntityManager => {
					await transactionalEntityManager.update(
						Users,
						{ idx: data.idx },
						{ password: data.password },
					);

					await transactionalEntityManager.update(
						EmailLog,
						{ token: data.token },
						{ is_active: false },
					);

					await transactionalEntityManager.save(PasswordHistoryLog, {
						password: data.password,
						user_id: data.user_id,
					});
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

	async updateProtocol(
		data:any
		): Promise<any> {

		try{
			let idx = data.idx
			await this.protocolRepo.update({ idx }, data.protocolUpdate);
		}
		catch (err) {
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
	async updateSettings(
		data:any
		): Promise<any> {
		try{
			if (!data.settings) {
				await this.employerSettingsRepo.save({
					...data.settingsDto,
					created_by: data.idx,
				});
			} else {
				await this.employerSettingsRepo.update({ created_by: data.idx }, data.settingsDto);
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

	async forgotPassword(
		data:any
		): Promise<any> {
			let otp_code = data.otp_code
		try{
			const optLogArray = await this.otpLogRepository.find({
				where: {
				   user: data.otpLog.user,
				  is_active: true,
				},
				relations: ['user']
			  });
			  
			if (optLogArray && Array.isArray(optLogArray) && optLogArray.length > 0) {
				let idsToUpdate = [];
				optLogArray.forEach(elm => {
					idsToUpdate.push(elm.id);
				  });
				  console.log('IDs to Update otplog ---> ' + idsToUpdate);
				  await getManager().transaction(async transactionalEntityManager => {
					await transactionalEntityManager
									.createQueryBuilder()
									.update(OtpLog)
									.set({ is_active: false, is_obsolete: true })
									.where({ id: In(idsToUpdate) })
									.execute();
					});
			}
			await this.otpLogRepository.save(data.otpLog);
			const mailData = {
				"otp_code":otp_code,
				"first_name": data.name,
				"operation": "reset password"
			};
			console.log('Mail Data to send');
			console.log(JSON.stringify(mailData));
			await sendMail(
				'Orbis',
				data.email,
				'reset',
				mailData,
				'Otp for forgot password',
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

	async resetPassword(
		data:any
		): Promise<any> {
		try{
			await getConnection().transaction(async transactionalEntityManager => {
				await transactionalEntityManager.update(
					OtpLog,
					{ otp_code: data.otp_code },
					{ is_active: false },
				);
				await transactionalEntityManager.update(
					Users,
					{ id: data.id },
					{ password: data.password, is_active: true },
				);
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

	async changePassword(
		data:any
		): Promise<any> {
		try{
			await this.usersRepo.update(
				{ idx: data.user_id.idx },
				{ password: data.password },
			);
	
			await this.passwordHistoryRepo.save({
				password: data.password,
				user_id: data.userExists,
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
}
