"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = exports.GetCAPTCHACode = void 0;
const threads_1 = require("threads");
const common_1 = require("@nestjs/common");
const captchaPool = threads_1.Pool(() => threads_1.spawn(new threads_1.Worker('./workers/captcha'), { timeout: 60000 }), 1);
async function GetCAPTCHACode() {
    return captchaPool
        .queue(async (auth) => await auth.hash())
        .then(async (result) => {
        await captchaPool.completed();
        return result;
    })
        .catch(e => {
        throw new common_1.InternalServerErrorException();
    });
}
exports.GetCAPTCHACode = GetCAPTCHACode;
async function verifyCaptcha(captcha, captcha_token) {
    return captchaPool
        .queue(async (auth) => await auth.verify(captcha, captcha_token))
        .then(async (result) => {
        await captchaPool.completed();
        return result;
    })
        .catch(e => {
        throw new common_1.InternalServerErrorException();
    });
}
exports.verifyCaptcha = verifyCaptcha;
//# sourceMappingURL=captcha.js.map