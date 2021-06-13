"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverOptions = exports.sendMail = exports.Axios = exports.handleError = exports.hashString = exports.getHost = exports.subtractDate = exports.readHTMLFile = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");
const threads_1 = require("threads");
const date_fns_1 = require("date-fns");
const passwordPool = threads_1.Pool(() => threads_1.spawn(new threads_1.Worker('./workers/password'), { timeout: 30000 }), 1);
const emailPool = threads_1.Pool(() => threads_1.spawn(new threads_1.Worker('./workers/sendMail'), { timeout: 30000 }), 1);
const readHTMLFile = function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                reject(err);
            }
            else {
                resolve(html);
            }
        });
    });
};
exports.readHTMLFile = readHTMLFile;
function subtractDate(unit, interval) {
    return new Date(date_fns_1.sub(new Date(), { [unit]: interval }));
}
exports.subtractDate = subtractDate;
function getHost() {
    return process.env.HOST_IP;
}
exports.getHost = getHost;
async function hashString(string) {
    return passwordPool
        .queue(async (auth) => await auth.hashString(string))
        .then(async (result) => {
        await passwordPool.completed();
        return result;
    })
        .catch(e => {
        throw new common_1.InternalServerErrorException();
    });
}
exports.hashString = hashString;
function handleError(error) {
    throw new common_1.HttpException(error.response.data.message, error.response.data.statusCode);
}
exports.handleError = handleError;
function getAxios() {
    if (fs.existsSync(path.resolve(`${__dirname}/../../${process.env.CERTIFICATE_VERIFY}`))) {
        const certVerifyFile = fs.readFileSync(path.resolve(`${__dirname}/../../${process.env.CERTIFICATE_VERIFY}`));
        return axios_1.default.create({
            httpsAgent: new https.Agent({
                ca: certVerifyFile,
            }),
        });
    }
    return axios_1.default.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });
}
exports.Axios = getAxios();
async function sendMail(from, to, mailTemplate, replacements, subject) {
    return emailPool
        .queue(async (email) => await email.sendMail(to, mailTemplate, replacements, subject))
        .then(async (result) => {
        await emailPool.completed();
        return result;
    })
        .catch(e => {
        console.info(e);
        throw new common_1.InternalServerErrorException();
    });
}
exports.sendMail = sendMail;
function serverOptions() {
    if (fs.existsSync(path.resolve(`${__dirname}/../${process.env.CERTIFICATE_FILE}`)) &&
        fs.existsSync(path.resolve(`${__dirname}/../${process.env.CERTIFICATE_KEY}`))) {
        const keyFile = fs.readFileSync(path.resolve(`${__dirname}/../${process.env.CERTIFICATE_KEY}`));
        const certFile = fs.readFileSync(path.resolve(`${__dirname}/../${process.env.CERTIFICATE_FILE}`));
        return {
            httpsOptions: {
                key: keyFile,
                cert: certFile,
            },
        };
    }
}
exports.serverOptions = serverOptions;
//# sourceMappingURL=helpers.js.map