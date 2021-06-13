"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPassword = void 0;
const class_validator_1 = require("class-validator");
let IsPasswordConstraint = class IsPasswordConstraint {
    async validate(value, _args) {
        const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
        return passwordRegex.test(value);
    }
    defaultMessage(arguments_) {
        const property = arguments_.property;
        return `${property} must be fulfill password's criteria`;
    }
};
IsPasswordConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsPasswordConstraint);
function IsPassword(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsPasswordConstraint,
        });
    };
}
exports.IsPassword = IsPassword;
//# sourceMappingURL=IsPassword.validator.js.map