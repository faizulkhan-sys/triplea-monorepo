import { Captcha } from './workers/captcha';
import { Pool, spawn, Thread, Worker } from 'threads';
import { InternalServerErrorException } from '@nestjs/common';

const captchaPool = Pool(
	() => spawn<Captcha>(new Worker('./workers/captcha'), { timeout: 60000 }),
	1 /* optional size */,
);

export async function GetCAPTCHACode(): Promise<string> {
	return captchaPool
		.queue(async auth => await auth.hash())
		.then(async result => {
			await captchaPool.completed();

			return result;
		})
		.catch(e => {
			throw new InternalServerErrorException();
		});
}

export async function verifyCaptcha(
	captcha: string,
	captcha_token: string,
): Promise<boolean> {
	return captchaPool
		.queue(async auth => await auth.verify(captcha, captcha_token))
		.then(async result => {
			await captchaPool.completed();

			return result;
		})
		.catch(e => {
			throw new InternalServerErrorException();
		});
}
