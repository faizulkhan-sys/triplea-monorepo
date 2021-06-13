"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndsWith = void 0;
const class_validator_1 = require("class-validator");
function EndsWith(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'endsWith',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    return typeof value === 'string' && value.endsWith('@orbispay.me');
                },
            },
        });
    };
}
exports.EndsWith = EndsWith;
//# sourceMappingURL=Endswith.js.map