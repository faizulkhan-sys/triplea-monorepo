import { expose } from 'threads/worker';
import * as CryptoJS from 'crypto-js';
import { customAlphabet } from 'nanoid/async';

const enc_key = 'AEON5c56!9E4e#MR';
const nanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
	6,
);

const captcha = {
	async hash(): Promise<string> {
		const str = await nanoid();

		return CryptoJS.AES.encrypt(str, enc_key).toString();
	},
	async verify(captcha: string, captcha_token: string): Promise<boolean> {
		const bytes = CryptoJS.AES.decrypt(captcha_token, enc_key);
		const originalText = bytes.toString(CryptoJS.enc.Utf8);

		if (captcha === originalText) {
			return true;
		}

		return false;
	},
};

export type Captcha = typeof captcha;

expose(captcha);
