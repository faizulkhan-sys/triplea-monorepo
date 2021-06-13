"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOptional = void 0;
const class_validator_1 = require("class-validator");
function IsOptional(validationOptions) {
    return class_validator_1.ValidateIf((_, value) => {
        return value !== null && value !== undefined && value !== '';
    }, validationOptions);
}
exports.IsOptional = IsOptional;
//# sourceMappingURL=customOptional.js.map