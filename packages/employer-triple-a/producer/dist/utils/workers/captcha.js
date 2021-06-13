"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("threads/worker");
const CryptoJS = require("crypto-js");
const async_1 = require("nanoid/async");
const enc_key = 'AEON5c56!9E4e#MR';
const nanoid = async_1.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz', 6);
const captcha = {
    async hash() {
        const str = await nanoid();
        return CryptoJS.AES.encrypt(str, enc_key).toString();
    },
    async verify(captcha, captcha_token) {
        const bytes = CryptoJS.AES.decrypt(captcha_token, enc_key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (captcha === originalText) {
            return true;
        }
        return false;
    },
};
worker_1.expose(captcha);
//# sourceMappingURL=captcha.js.map