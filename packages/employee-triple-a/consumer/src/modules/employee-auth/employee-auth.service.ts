import { subtractDate } from '@utils/helpers';
import {
	HttpException,
	HttpStatus,
	Injectable,
	Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '@common/constants/status.enum';
import { Customer } from '@entities/Customer.entity';
import { Protocol } from '@entities/Protocol.entity';
import { ActivityLog } from '@entities/ActivityLog.entity';
import { OtpLog } from '@entities/OtpLog.entity';
import {endOfDay,startOfDay} from 'date-fns';
import {sendMail} from '@utils/helpers';
import {checkForFailedMpin} from '@utils/dbHelpers';
import config from '@config/index';
import { EmployeeLoginDto} from '@dtos/employeeLogin.dto';
import {Repository,Between, getConnection,In, getManager } from 'typeorm';
import { SearchFilters } from '@entities/SearchFilters.entity';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
const logger = new Logger('Create Employee Login DB Writer');

@Injectable()
export class EmployeeAuthService {
  constructor(
	@InjectRepository(SearchFilters)
		private readonly searchFilterRepo: Repository<SearchFilters>,
    @InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Protocol)
		private readonly protocolRepo: Repository<Protocol>,
	@InjectRepository(ActivityLog)
		private readonly activityLogRepo: Repository<ActivityLog>,
	@InjectRepository(OtpLog)
		private readonly otpLogRepository: Repository<OtpLog>,
  ) {}

  async loginEmployeeSaveActivity(data:any): Promise<any> {
	try{
		await this.activityLogRepo.save({
			ip_address: '',
			device_id: '',
			login_type: 'MOBILE',
			login_status: true,
			user: data.user,
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
  async loginEmployeeSaveActivityForFailed(data:any): Promise<any> {
	try{
		await this.activityLogRepo.save({
			ip_address: '',
			device_id: '',
			login_type: 'MOBILE',
			login_status: false,
			status: false,
			user: data.user,
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
  
  async loginEmployeeUpdateActivity(data:any): Promise<any> {
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

  
  async loginUpdateEmployeeAccount(data:any): Promise<any> {
	try{
		await this.customerRepository.update({ id: data.id }, { is_active: data.is_active });
	}
	catch (err) {
		logger.error(err);
		throw new HttpException(
		INTERNAL_SERVER_ERROR_MESSAGE,
		HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
  //reset mpin service
  async resetMpin(
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
				Customer,
				{ id: data.id },
				{ mpin: data.mpin },
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

async forgetMpin(
	data:any
	): Promise<any> {
	const otp_code = data.otp_code
	try{
		await this.otpLogRepository.save(data);
		const mailData = {
			"otp_code":otp_code,
			"first_name": data.user.first_name,
			"operation": 'reset mpin'
		};	
		await sendMail(data.user.email, 'reset', mailData, 'Otp for forgot mpin');
	}
	catch (err) {
		logger.error(err);
		throw new HttpException(
		  INTERNAL_SERVER_ERROR_MESSAGE,
		  HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

}
async changeMpin(
	data:any
	): Promise<any> {
	try{
		await this.customerRepository.update(
			{ idx: data.idx },
			{ mpin: data.new_mpin },
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

async changePassword(
	data:any
	): Promise<any> {
	try{
		await this.customerRepository.update(
			{ idx: data.idx },
			{ password: data.password },
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
				Customer,
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

async verifyMpin(
	data:any
	): Promise<any> {
	if(data.activity_type === 'DEACTIVATE'){
		try {
			console.log("Deactivating account")
			await getConnection()
			.getRepository(Customer)
			.update({ id: data.customer.id }, { is_active: false });
		}
		catch(err){
			logger.error(err);
			throw new HttpException(
			INTERNAL_SERVER_ERROR_MESSAGE,
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
		
	}
	else{
		try{
			await checkForFailedMpin(data.customer, data.device, data.ip, data.login_type,data.activity_type);
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


async setMpin(
	data:any
	): Promise<any> {
	try{
		await this.customerRepository.update(
			{ idx: data.idx },
			{ is_mpin_set: true, mpin: data.mpin },
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

async forgotPassword(
	data:any
	): Promise<any> {
		let otp_code = data.data.otp_code
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
			otp_code,
			email: data.data.email,
			name: data.data.first_name,
			operation: 'reset password',
		};

		await sendMail(
			data.data.email,
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

async signupEmployee(
	data:any
	): Promise<any> {
		
	try{
		await getConnection().transaction(async transactionalEntityManager => {
			transactionalEntityManager.update(
				Customer,
				{ idx: data.signUpDto.idx },
				{
					password: data.password,
					is_password_set: true,
					email: data.signUpDto.email,
					is_registered: true,
					sort_order: 2,
					is_first_time_import: false,
				},
			);

			await transactionalEntityManager.getRepository(ActivityLog).save({
				ip_address: '',
				device_id: '',
				login_type: 'MOBILE',
				login_status: true,
				user: data.checkIdxExists,
				activity_type: 'LOGIN',
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

async createFilter(
	data:any
	): Promise<any> {
	try{
		await this.searchFilterRepo.save(data.searchFilter);
	}
	catch (err) {
		logger.error(err);
		throw new HttpException(
		INTERNAL_SERVER_ERROR_MESSAGE,
		HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}

}

async upadateFilter(
	data:any
	): Promise<any> {
	try{
		if(data.type === 'default'){
			const idx = data.idx;
			const employerIdx = data.employerIdx
			const is_active = data.is_active
			await this.searchFilterRepo.update(
				{ idx, created_by: employerIdx },
				{ is_active: is_active },
			);
		}
		else{
			const idx = data.idx;
			const employerIdx = data.employerIdx
			const updateDto = data.updateDto
			await this.searchFilterRepo.update(
				{ idx, created_by: employerIdx },
				updateDto,
			);
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

async deleteFilter(
	data:any
	): Promise<any> {
	try{
		const idx = data.idx;
		const employerIdx = data.employerIdx;
		await this.searchFilterRepo.update(
			{ idx, is_obsolete: false, created_by: employerIdx },
			{ is_obsolete: true },
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


}
