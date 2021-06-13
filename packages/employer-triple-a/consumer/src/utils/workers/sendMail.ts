import { expose } from 'threads/worker';
import {Channels, NotificationPayload} from '@common/interfaces/notification.payload';
import * as eta from 'eta';
import { createTransport } from 'nodemailer';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as config from '@config/index';
import axios from 'axios';

const logger: Logger = new Logger('SendMail');

const email = {
	async sendMail(
		to: string,
		mailTemplate: string,
		replacements: any,
		subject: string,
	) {
		console.log('Inside Send mail before Axios call');
		const notificationObject:NotificationPayload = {
			sendTo:to,
			notificationHeader:subject,
			type: "notify",
			notificationBody: replacements,
			sendChannel: Channels.MAIL,
			template:mailTemplate
		};
		console.log('Inside Send mail before Axios call');
		console.log('Axios call to URL -> ' + config.default.notificationChannel);
		const headers = {
			'Content-Type': 'application/json; charset=UTF-8'
		}
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		const response = await axios.post(config.default.notificationChannel, JSON.stringify(notificationObject), {
							headers: headers
						})
						.then((response) => {
							console.log("notificationObject sent to sendChannel");
						})
						.catch((error) => {
							console.log(error);
						});
	},
};

export type Email = typeof email;

expose(email);
