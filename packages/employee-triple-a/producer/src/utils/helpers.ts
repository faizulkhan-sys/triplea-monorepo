import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import axios from 'axios';
import { classToPlain } from 'class-transformer';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { getConnection } from 'typeorm';
import * as squel from 'squel';
import * as _ from 'lodash';
import { Pool, spawn, Worker } from 'threads';
import { Password } from './workers/password';
import { AuthenticationPayload } from '@common/interfaces/authentication.interface';
import { Customer } from '@entities/Customer.entity';
import {
  add,
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  format,
  sub,
  isValid,
} from 'date-fns';
import { pick } from '@rubiin/js-utils';

const passwordPool = Pool(
	() => spawn<Password>(new Worker('./workers/password'), { timeout: 30000 }),
	1 /* optional size */,
);

export function subtractDate(unit: string, interval: number) {
	return new Date(sub(new Date(), { [unit]: interval }));
}

export function buildResponsePayload(
	user: Customer,
	accessToken: string,
	refreshToken?: string,
): AuthenticationPayload {
	const is_mobile_set = user.mobile_number == '' || null ? false : true;

	return {
		user: {
			...pick(user, [
				'id',
				'idx',
				'first_name',
				'middle_name',
				'last_name',
				'email',
				'employer_id',
				'is_mpin_set',
				'sa_status',
				'is_bank_set',
				'is_debitcard',
			]),
			is_mobile_set,
		},
		payload: {
			access_token: accessToken,
			...(refreshToken ? { refresh_token: refreshToken } : {}),
		},
	};
}

export async function hashString(str: string): Promise<string> {
	return passwordPool
		.queue(async pwd => await pwd.hashString(str))
		.then(async result => {
			await passwordPool.completed();

			return result;
		})
		.catch(_e => {
			throw new InternalServerErrorException();
		});
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

export function parseDateOnly(date: Date) {
  return format(new Date(date), 'yyyy/MM/dd');
}

export function addMaxTimeOnDate(date: Date) {
  const new_date = new Date(date);

  return endOfDay(new_date);
}

export function paginate(
  pages: number,
  page: number,
  total: number,
  host: string,
  result: any[],
) {
  return {
    total_pages: pages,
    total_items: total,
    next: hasNext(page, pages, host),
    previous: hasPrevious(page, pages, host),
    current_page: page,
    items: classToPlain(result),
  };
}

export function hasNext(page: number, totalPages: number, hostAddress: string) {
  if (page === totalPages) {
    return '';
  } else {
    return `${hostAddress.replace('\n', '')}?page=${page + 1}`;
  }
}

export function hasPrevious(
  page: number,
  totalPages: number,
  hostAddress: string,
) {
  if (page <= 1) {
    return '';
  } else {
    return `${hostAddress.replace('\n', '')}?page=${page - 1}`;
  }
}

export function validateUUID(idx: string) {
  if (!isUUID(idx, 'all')) {
    throw new HttpException('Invalid idx', HttpStatus.BAD_REQUEST);
  }
}

export function isValidDate(date: string) {
  return isValid(new Date(date));
}

export function isFutureDate(date: string): boolean {
  const now = new Date();

  now.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);

  console.info(now, inputDate);

  if (inputDate < now) {
    return false;
  }

  return true;
}

export function fixed2DigitDecimal(num: number, fixed = 2) {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');

  return parseFloat(num.toString().match(re)[0]);
}

export async function getEmployerData(idxs: any[]) {
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

  return await getConnection().query(query);
}

export async function getEmployeeData(idxs: string[]) {
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

  return await getConnection().query(query);
}

export async function getEmployeeNames(idxs: any[]) {
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

  return await getConnection().query(query);
}

export async function getAccessToken(): Promise<string> {
  const data = formUrlEncoded({
    client_id: process.env.PAYCHEX_CLIENT_ID,
    client_secret: process.env.PAYCHEX_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });
  const response = await axios
    .post(process.env.PAYCHEX_URL + '/auth/oauth/v2/token', data)
    .catch((response) => {
      throw new HttpException(response, 400);
    });

  return response.data.access_token;
}

export async function getPayComponent(token: string, workerId: string) {
  const response = await axios
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

export const formUrlEncoded = (x: {
  [x: string]: string | number | boolean;
  client_id?: string;
  client_secret?: string;
  grant_type?: string;
}) =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

export function formatErrors(errors: any[]): string[] {
  const formattedErrors = [];

  for (const error of errors) {
    formattedErrors.push(_.values(error.constraints));
  }

  return _.flattenDeep(formattedErrors);
}

export function excelPaycycleHelper(
  paycycle: string,
  end_date: string,
  employer_provider: string,
) {
  if (paycycle.toLowerCase() === 'weekly') {
    const result: any = {};

    result.payroll_run_date = format(
      addDays(new Date(end_date), 5),
      'MM/dd/yyyy',
    );
    result.payroll_date = format(addDays(new Date(end_date), 7), 'MM/dd/yyyy');

    result.deduction_run_date = format(
      addDays(new Date(end_date), 5),
      'MM/dd/yyyy',
    );
    result.deduction_run_time = '11:59 pm';
    result.next_payroll_run_date = format(
      addDays(new Date(end_date), 12),
      'MM/dd/yyyy',
    );
    result.next_payroll_date = format(
      addDays(new Date(end_date), 14),
      'MM/dd/yyyy',
    );
    result.next_deduction_run_date = format(
      addDays(new Date(end_date), 12),
      'MM/dd/yyyy',
    );
    result.next_deduction_run_time = '11:59 pm';

    if (employer_provider.toLowerCase() === 'paychex') {
      result.payroll_run_date = format(
        addDays(new Date(end_date), 3),
        'MM/dd/yyyy',
      );
      result.deduction_run_date = format(
        addDays(new Date(end_date), 3),
        'MM/dd/yyyy',
      );
      result.deduction_run_time = '11:59 pm';
      result.next_payroll_run_date = format(
        addDays(new Date(end_date), 10),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_date = format(
        addDays(new Date(end_date), 10),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_time = '11:59 pm';
    }

    return result;
  } else if (
    paycycle.toLowerCase() === 'bi-weekly' ||
    paycycle.toLowerCase() === 'bi_weekly'
  ) {
    const result: any = {};

    result.payroll_run_date = format(
      addDays(new Date(end_date), 5),
      'MM/dd/yyyy',
    );
    result.payroll_date = format(addDays(new Date(end_date), 7), 'MM/dd/yyyy');
    result.deduction_run_date = format(
      addDays(new Date(end_date), 5),
      'MM/dd/yyyy',
    );
    result.deduction_run_time = '11:59 pm';
    result.next_payroll_run_date = format(
      addDays(new Date(end_date), 19),
      'MM/dd/yyyy',
    );
    result.next_payroll_date = format(
      addDays(new Date(end_date), 21),
      'MM/dd/yyyy',
    );
    result.next_deduction_run_date = format(
      addDays(new Date(end_date), 19),
      'MM/dd/yyyy',
    );
    result.next_deduction_run_time = '11:59 pm';

    if (employer_provider.toLowerCase() === 'paychex') {
      result.payroll_run_date = format(
        addDays(new Date(end_date), 3),
        'MM/dd/yyyy',
      );
      result.deduction_run_date = format(
        addDays(new Date(end_date), 3),
        'MM/dd/yyyy',
      );
      result.deduction_run_time = '11:59 pm';
      result.next_payroll_run_date = format(
        addDays(new Date(end_date), 17),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_date = format(
        addDays(new Date(end_date), 17),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_time = '11:59 pm';
    }

    return result;
  } else if (paycycle.toLowerCase() === 'monthly') {
    console.info('employees monthly end date ', end_date);

    const result: any = {};

    result.payroll_run_date = format(
      addDays(new Date(end_date), -2),
      'MM/dd/yyyy',
    );
    result.payroll_date = format(endOfMonth(new Date(end_date)), 'MM/dd/yyyy');
    result.deduction_run_date = format(
      addDays(new Date(end_date), -2),
      'MM/dd/yyyy',
    );
    result.deduction_run_time = '11:59 pm';
    result.next_payroll_run_date = format(
      addDays(endOfMonth(addMonths(new Date(end_date), 1)), -4),
      'MM/dd/yyyy',
    );
    result.next_payroll_date = format(
      add(
        endOfMonth(
          add(new Date(end_date), {
            months: 1,
          }),
        ),
        { days: -2 },
      ),
      'MM/dd/yyyy',
    );

    result.next_deduction_run_date = format(
      addDays(endOfMonth(addMonths(new Date(end_date), 1)), -4),
      'MM/dd/yyyy',
    );
    result.next_deduction_run_time = '11:59 pm';

    if (employer_provider.toLowerCase() === 'paychex') {
      result.payroll_run_date = format(
        addDays(new Date(end_date), -3),
        'MM/dd/yyyy',
      );
      result.deduction_run_date = format(
        addDays(new Date(end_date), -3),
        'MM/dd/yyyy',
      );
      result.deduction_run_time = '11:59 pm';
      result.next_payroll_run_date = format(
        addDays(endOfMonth(addMonths(new Date(end_date), 1)), -6),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_date = format(
        addDays(endOfMonth(addMonths(new Date(end_date), 1)), -6),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_time = '11:59 pm';
    }

    return result;
  } else if (
    paycycle.toLowerCase() === 'semi-monthly' ||
    paycycle.toLowerCase() === 'semi_monthly'
  ) {
    console.info('employees semi monthly end date ', end_date);

    const result: any = {};

    result.payroll_run_date = format(
      addDays(new Date(end_date), -4),
      'MM/dd/yyyy',
    );
    result.payroll_date = format(new Date(end_date), 'MM/dd/yyyy');
    result.deduction_run_date = format(
      addDays(new Date(end_date), -4),
      'MM/dd/yyyy',
    );
    result.deduction_run_time = '11:59 pm';

    result.next_payroll_run_date = format(
      addDays(new Date(end_date), 14),
      'MM/dd/yyyy',
    );
    result.next_payroll_date = format(
      add(new Date(end_date), {
        days: 16,
      }),
      'MM/dd/yyyy',
    );

    result.next_deduction_run_date = format(
      addDays(new Date(end_date), 14),
      'MM/dd/yyyy',
    );
    result.next_deduction_run_time = '11:59 pm';

    if (employer_provider.toLowerCase() === 'paychex') {
      result.payroll_run_date = format(
        addDays(new Date(end_date), -6),
        'MM/dd/yyyy',
      );
      result.deduction_run_date = format(
        addDays(new Date(end_date), -6),
        'MM/dd/yyyy',
      );
      result.deduction_run_time = '11:59 pm';
      result.next_payroll_run_date = format(
        addDays(new Date(end_date), 12),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_date = format(
        addDays(new Date(end_date), 12),
        'MM/dd/yyyy',
      );
      result.next_deduction_run_time = '11:59 pm';
    }

    return result;
  }
}
export function getHost(): string {
	return process.env.HOST_IP;
}
// Generate Unique ID
export async function uniqueID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

/**
 * Convert's Date to Date String. Format -> mm/dd/yyyy. Example: (03/09/2021)
 * @param {Date} date - The date instance to convert
 * @return {Promise<string>>} - Returns promise of string date.
 */
export async function dateToString(date: Date): Promise<string> {
  const yearStr = date.getFullYear().toString();
  let monthStr = (date.getMonth() + 1).toString();
  let dateStr = date.getDate().toString();

  monthStr = monthStr.length == 2 ? monthStr : '0' + monthStr;
  dateStr = dateStr.length == 2 ? dateStr : '0' + dateStr;

  return monthStr + '/' + dateStr + '/' + yearStr;
}

export function removeEmpty(obj: Record<string, any> | ArrayLike<unknown>) {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (v === null ? a : { ...a, [k]: v }),
    {},
  );
}
