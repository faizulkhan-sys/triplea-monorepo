import { HttpException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { Pool, spawn, Worker } from 'threads';
import { Email } from './workers/sendMail';
import { Password } from './workers/password';
import { sub } from 'date-fns';

const passwordPool = Pool(
	() => spawn<Password>(new Worker('./workers/password'), { timeout: 30000 }),
	1 /* optional size */,
);

const emailPool = Pool(
	() => spawn<Email>(new Worker('./workers/sendMail'), { timeout: 30000 }),
	1 /* optional size */,
);

export const readHTMLFile = function (path: string) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
			if (err) {
				reject(err);
			} else {
				resolve(html);
			}
		});
	});
};

export function subtractDate(unit: string, interval: number) {
	return new Date(sub(new Date(), { [unit]: interval }));
}

export function getHost(): string {
	return process.env.HOST_IP;
}

export async function hashString(string: string): Promise<string> {
	return passwordPool
		.queue(async auth => await auth.hashString(string))
		.then(async result => {
			await passwordPool.completed();

			return result;
		})
		.catch(e => {
			throw new InternalServerErrorException();
		});
}

export function handleError(error: {
	response: {
		data: { message: string | Record<string, any>; statusCode: number };
	};
}): any {
	throw new HttpException(
		error.response.data.message,
		error.response.data.statusCode,
	);
}

function getAxios() {
	if (
		fs.existsSync(
			path.resolve(`${__dirname}/../../${process.env.CERTIFICATE_VERIFY}`),
		)
	) {
		const certVerifyFile = fs.readFileSync(
			path.resolve(`${__dirname}/../../${process.env.CERTIFICATE_VERIFY}`),
		);

		return axios.create({
			httpsAgent: new https.Agent({
				ca: certVerifyFile,
			}),
		});
	}

	return axios.create({
		httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		}),
	});
}

export const Axios = getAxios();

export async function sendMail(
	from: string,
	to: string,
	mailTemplate: string,
	replacements: any,
	subject: string,
) {
	return emailPool
		.queue(
			async email =>
				await email.sendMail(to, mailTemplate, replacements, subject),
		)
		.then(async result => {
			await emailPool.completed();

			return result;
		})
		.catch(e => {
			console.info(e);
			throw new InternalServerErrorException();
		});
}

export function serverOptions() {
	if (
		fs.existsSync(
			path.resolve(`${__dirname}/../${process.env.CERTIFICATE_FILE}`),
		) &&
		fs.existsSync(
			path.resolve(`${__dirname}/../${process.env.CERTIFICATE_KEY}`),
		)
	) {
		const keyFile = fs.readFileSync(
			path.resolve(`${__dirname}/../${process.env.CERTIFICATE_KEY}`),
		);

		const certFile = fs.readFileSync(
			path.resolve(`${__dirname}/../${process.env.CERTIFICATE_FILE}`),
		);

		return {
			httpsOptions: {
				key: keyFile,
				cert: certFile,
			},
		};
	}
}
