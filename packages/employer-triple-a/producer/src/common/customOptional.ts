import { ValidateIf, ValidationOptions } from 'class-validator';

/**
 *
 *
 * @export
 * @param {ValidationOptions} [validationOptions]
 * @return {*}
 */

export function IsOptional(validationOptions?: ValidationOptions) {
	return ValidateIf((obj, value) => {
		return value !== null && value !== undefined && value !== '';
	}, validationOptions);
}
