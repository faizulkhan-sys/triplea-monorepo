"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsGreaterThan = void 0;
const class_validator_1 = require("class-validator");
function IsGreaterThan(property, validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'isGreaterThan',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return (typeof value === 'number' &&
                        typeof relatedValue === 'number' &&
                        value > relatedValue);
                },
            },
        });
    };
}
exports.IsGreaterThan = IsGreaterThan;
//# sourceMappingURL=IsGreater.valiator.js.map