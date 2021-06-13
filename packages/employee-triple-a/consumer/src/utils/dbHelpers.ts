
import { ActivityLog } from '@entities/ActivityLog.entity';
import { Customer } from '@entities/Customer.entity';
import { Protocol } from '@entities/Protocol.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
	startOfDay,
	endOfDay,
} from 'date-fns';
import * as lodash from 'lodash';
import { getConnection, Between, In } from 'typeorm';
import { subtractDate } from './helpers';

export async function checkForFailedMpin(
	customer: Customer,
	device: string,
	ip: string,
	login_type: string,
	activity_type: string,
): Promise<void> {
	await getConnection().getRepository(ActivityLog).save({
		ip_address: '',
		device_id: device,
		login_type,
		status: false,
		user: customer,
		activity_type,
	});

	// const protocolSettings = await getConnection()
	// 	.getRepository(Protocol)
	// 	.findOne({
	// 		where: {
	// 			is_active: true,
	// 			is_obsolete: false,
	// 		},
	// 		select: [
	// 			'mpin_attempt_interval',
	// 			'mpin_interval_unit',
	// 			'mpin_max_retry',
	// 		],
	// 	});

	// const activityLog = await getConnection()
	// 	.getRepository(ActivityLog)
	// 	.find({
	// 		where: {
	// 			created_on: Between(
	// 				startOfDay(
	// 					subtractDate(
	// 						protocolSettings.login_interval_unit,
	// 						protocolSettings.login_attempt_interval,
	// 					),
	// 				).toISOString(),
	// 				endOfDay(new Date()).toISOString(),
	// 			),
	// 			status: false,
	// 			user: customer,
	// 			activity_type: 'MPIN_VERIFY',
	// 		},
	// 	});

	// if (activityLog.length >= protocolSettings.mpin_max_retry) {
	// 	await getConnection()
	// 		.getRepository(Customer)
	// 		.update({ id: customer.id }, { is_active: false });

	// 	throw new HttpException(
	// 		{
	// 			message: 'Oops! ',
	// 			sub:
	// 				'Sorry the account has been locked. Please connect with our Customer Care.',
	// 		},
	// 		HttpStatus.FORBIDDEN,
	// 	);
	// }

	// throw new HttpException(
	// 	{
	// 		message: 'Oops! Invalid MPIN',
	// 		sub: `Sorry the MPIN was invalid.You have ${
	// 			protocolSettings.mpin_max_retry - activityLog.length
	// 		} attempts left before your account gets locked.`,
	// 	},
	// 	HttpStatus.UNAUTHORIZED,
	// );
}
