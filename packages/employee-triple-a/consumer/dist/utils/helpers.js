"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmpty = exports.dateToString = exports.uniqueID = exports.excelPaycycleHelper = exports.formatErrors = exports.formUrlEncoded = exports.getPayComponent = exports.getAccessToken = exports.getEmployeeNames = exports.sendMail = exports.getEmployeeData = exports.getEmployerData = exports.fixed2DigitDecimal = exports.isFutureDate = exports.getHost = exports.isValidDate = exports.validateUUID = exports.hasPrevious = exports.hasNext = exports.paginate = exports.addMaxTimeOnDate = exports.parseDateOnly = exports.Axios = exports.subtractDate = void 0;
const common_1 = require("@nestjs/common");
const is_uuid_1 = require("@nestjs/common/utils/is-uuid");
const axios_1 = require("axios");
const class_transformer_1 = require("class-transformer");
const https = require("https");
const typeorm_1 = require("typeorm");
const squel = require("squel");
const _ = require("lodash");
const Customer_entity_1 = require("../entities/Customer.entity");
const threads_1 = require("threads");
const date_fns_1 = require("date-fns");
const mailPool = threads_1.Pool(() => threads_1.spawn(new threads_1.Worker('./workers/sendMail'), { timeout: 30000 }), 1);
function subtractDate(unit, interval) {
    return new Date(date_fns_1.sub(new Date(), { [unit]: interval }));
}
exports.subtractDate = subtractDate;
function getAxios() {
    return axios_1.default.create({
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });
}
exports.Axios = getAxios();
function parseDateOnly(date) {
    return date_fns_1.format(new Date(date), 'yyyy/MM/dd');
}
exports.parseDateOnly = parseDateOnly;
function addMaxTimeOnDate(date) {
    const new_date = new Date(date);
    return date_fns_1.endOfDay(new_date);
}
exports.addMaxTimeOnDate = addMaxTimeOnDate;
function paginate(pages, page, total, host, result) {
    return {
        total_pages: pages,
        total_items: total,
        next: hasNext(page, pages, host),
        previous: hasPrevious(page, pages, host),
        current_page: page,
        items: class_transformer_1.classToPlain(result),
    };
}
exports.paginate = paginate;
function hasNext(page, totalPages, hostAddress) {
    if (page === totalPages) {
        return '';
    }
    else {
        return `${hostAddress.replace('\n', '')}?page=${page + 1}`;
    }
}
exports.hasNext = hasNext;
function hasPrevious(page, totalPages, hostAddress) {
    if (page <= 1) {
        return '';
    }
    else {
        return `${hostAddress.replace('\n', '')}?page=${page - 1}`;
    }
}
exports.hasPrevious = hasPrevious;
function validateUUID(idx) {
    if (!is_uuid_1.isUUID(idx, 'all')) {
        throw new common_1.HttpException('Invalid idx', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.validateUUID = validateUUID;
function isValidDate(date) {
    return date_fns_1.isValid(new Date(date));
}
exports.isValidDate = isValidDate;
function getHost() {
    return process.env.HOST_IP;
}
exports.getHost = getHost;
function isFutureDate(date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    console.info(now, inputDate);
    if (inputDate < now) {
        return false;
    }
    return true;
}
exports.isFutureDate = isFutureDate;
function fixed2DigitDecimal(num, fixed = 2) {
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return parseFloat(num.toString().match(re)[0]);
}
exports.fixed2DigitDecimal = fixed2DigitDecimal;
async function getEmployerData(idxs) {
    console.info(' employer idxs is ', idxs);
    if (idxs.length <= 0) {
        return [];
    }
    const query = squel
        .select()
        .from('"dbo".Users')
        .field('idx')
        .field('company_name')
        .field('company_id')
        .field('payroll_system')
        .field('display_id')
        .field('contact_name')
        .where('idx in (?)', idxs)
        .toString()
        .replace('((', '(')
        .replace('))', ')');
    console.info(' quere is ', query);
    return await typeorm_1.getConnection().query(query);
}
exports.getEmployerData = getEmployerData;
async function getEmployeeData(idxs) {
    if (idxs.length <= 0) {
        return [];
    }
    const query = squel
        .select()
        .from('"dbo".Customer')
        .field('idx')
        .field('worker_id')
        .field('pay_frequency')
        .field('employee_id')
        .field('first_name')
        .field('middle_name')
        .field('last_name')
        .field('residential_address')
        .field('salary_type')
        .where('idx in (?)', idxs)
        .toString()
        .replace('((', '(')
        .replace('))', ')');
    return await typeorm_1.getConnection().query(query);
}
exports.getEmployeeData = getEmployeeData;
async function sendMail(to, mailTemplate, replacements, subject) {
    return mailPool
        .queue(async (email) => await email.sendMail(to, mailTemplate, replacements, subject))
        .then(async (result) => {
        await mailPool.completed();
        return result;
    })
        .catch(_e => {
        throw new common_1.InternalServerErrorException();
    });
}
exports.sendMail = sendMail;
async function getEmployeeNames(idxs) {
    const query = squel
        .select()
        .from('"dbo".Customer')
        .field('idx')
        .field('first_name')
        .field('middle_name')
        .field('last_name')
        .where('idx in (?)', idxs)
        .toString()
        .replace('((', '(')
        .replace('))', ')');
    return await typeorm_1.getConnection().query(query);
}
exports.getEmployeeNames = getEmployeeNames;
async function getAccessToken() {
    const data = exports.formUrlEncoded({
        client_id: process.env.PAYCHEX_CLIENT_ID,
        client_secret: process.env.PAYCHEX_CLIENT_SECRET,
        grant_type: 'client_credentials',
    });
    const response = await axios_1.default
        .post(process.env.PAYCHEX_URL + '/auth/oauth/v2/token', data)
        .catch((response) => {
        throw new common_1.HttpException(response, 400);
    });
    return response.data.access_token;
}
exports.getAccessToken = getAccessToken;
async function getPayComponent(token, workerId) {
    const response = await axios_1.default
        .get(process.env.PAYCHEX_URL + `/workers/${workerId}`, {
        headers: {
            Authorization: 'Bearer ' + token,
        },
    })
        .catch((error) => {
        console.error(error.response.data);
    });
    return response ? response : null;
}
exports.getPayComponent = getPayComponent;
const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
exports.formUrlEncoded = formUrlEncoded;
function formatErrors(errors) {
    const formattedErrors = [];
    for (const error of errors) {
        formattedErrors.push(_.values(error.constraints));
    }
    return _.flattenDeep(formattedErrors);
}
exports.formatErrors = formatErrors;
function excelPaycycleHelper(paycycle, end_date, employer_provider) {
    if (paycycle.toLowerCase() === 'weekly') {
        const result = {};
        result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 5), 'MM/dd/yyyy');
        result.payroll_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 7), 'MM/dd/yyyy');
        result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 5), 'MM/dd/yyyy');
        result.deduction_run_time = '11:59 pm';
        result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 12), 'MM/dd/yyyy');
        result.next_payroll_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 14), 'MM/dd/yyyy');
        result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 12), 'MM/dd/yyyy');
        result.next_deduction_run_time = '11:59 pm';
        if (employer_provider.toLowerCase() === 'paychex') {
            result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 3), 'MM/dd/yyyy');
            result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 3), 'MM/dd/yyyy');
            result.deduction_run_time = '11:59 pm';
            result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 10), 'MM/dd/yyyy');
            result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 10), 'MM/dd/yyyy');
            result.next_deduction_run_time = '11:59 pm';
        }
        return result;
    }
    else if (paycycle.toLowerCase() === 'bi-weekly' ||
        paycycle.toLowerCase() === 'bi_weekly') {
        const result = {};
        result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 5), 'MM/dd/yyyy');
        result.payroll_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 7), 'MM/dd/yyyy');
        result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 5), 'MM/dd/yyyy');
        result.deduction_run_time = '11:59 pm';
        result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 19), 'MM/dd/yyyy');
        result.next_payroll_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 21), 'MM/dd/yyyy');
        result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 19), 'MM/dd/yyyy');
        result.next_deduction_run_time = '11:59 pm';
        if (employer_provider.toLowerCase() === 'paychex') {
            result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 3), 'MM/dd/yyyy');
            result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 3), 'MM/dd/yyyy');
            result.deduction_run_time = '11:59 pm';
            result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 17), 'MM/dd/yyyy');
            result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 17), 'MM/dd/yyyy');
            result.next_deduction_run_time = '11:59 pm';
        }
        return result;
    }
    else if (paycycle.toLowerCase() === 'monthly') {
        console.info('employees monthly end date ', end_date);
        const result = {};
        result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -2), 'MM/dd/yyyy');
        result.payroll_date = date_fns_1.format(date_fns_1.endOfMonth(new Date(end_date)), 'MM/dd/yyyy');
        result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -2), 'MM/dd/yyyy');
        result.deduction_run_time = '11:59 pm';
        result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(date_fns_1.endOfMonth(date_fns_1.addMonths(new Date(end_date), 1)), -4), 'MM/dd/yyyy');
        result.next_payroll_date = date_fns_1.format(date_fns_1.add(date_fns_1.endOfMonth(date_fns_1.add(new Date(end_date), {
            months: 1,
        })), { days: -2 }), 'MM/dd/yyyy');
        result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(date_fns_1.endOfMonth(date_fns_1.addMonths(new Date(end_date), 1)), -4), 'MM/dd/yyyy');
        result.next_deduction_run_time = '11:59 pm';
        if (employer_provider.toLowerCase() === 'paychex') {
            result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -3), 'MM/dd/yyyy');
            result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -3), 'MM/dd/yyyy');
            result.deduction_run_time = '11:59 pm';
            result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(date_fns_1.endOfMonth(date_fns_1.addMonths(new Date(end_date), 1)), -6), 'MM/dd/yyyy');
            result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(date_fns_1.endOfMonth(date_fns_1.addMonths(new Date(end_date), 1)), -6), 'MM/dd/yyyy');
            result.next_deduction_run_time = '11:59 pm';
        }
        return result;
    }
    else if (paycycle.toLowerCase() === 'semi-monthly' ||
        paycycle.toLowerCase() === 'semi_monthly') {
        console.info('employees semi monthly end date ', end_date);
        const result = {};
        result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -4), 'MM/dd/yyyy');
        result.payroll_date = date_fns_1.format(new Date(end_date), 'MM/dd/yyyy');
        result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -4), 'MM/dd/yyyy');
        result.deduction_run_time = '11:59 pm';
        result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 14), 'MM/dd/yyyy');
        result.next_payroll_date = date_fns_1.format(date_fns_1.add(new Date(end_date), {
            days: 16,
        }), 'MM/dd/yyyy');
        result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 14), 'MM/dd/yyyy');
        result.next_deduction_run_time = '11:59 pm';
        if (employer_provider.toLowerCase() === 'paychex') {
            result.payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -6), 'MM/dd/yyyy');
            result.deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), -6), 'MM/dd/yyyy');
            result.deduction_run_time = '11:59 pm';
            result.next_payroll_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 12), 'MM/dd/yyyy');
            result.next_deduction_run_date = date_fns_1.format(date_fns_1.addDays(new Date(end_date), 12), 'MM/dd/yyyy');
            result.next_deduction_run_time = '11:59 pm';
        }
        return result;
    }
}
exports.excelPaycycleHelper = excelPaycycleHelper;
async function uniqueID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.uniqueID = uniqueID;
async function dateToString(date) {
    const yearStr = date.getFullYear().toString();
    let monthStr = (date.getMonth() + 1).toString();
    let dateStr = date.getDate().toString();
    monthStr = monthStr.length == 2 ? monthStr : '0' + monthStr;
    dateStr = dateStr.length == 2 ? dateStr : '0' + dateStr;
    return monthStr + '/' + dateStr + '/' + yearStr;
}
exports.dateToString = dateToString;
function removeEmpty(obj) {
    return Object.entries(obj).reduce((a, [k, v]) => (v === null ? a : Object.assign(Object.assign({}, a), { [k]: v })), {});
}
exports.removeEmpty = removeEmpty;
//# sourceMappingURL=helpers.js.map