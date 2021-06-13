"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHeader = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../utils/helpers");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.RequestHeader = common_1.createParamDecorator(async (value, ctx) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const dto = class_transformer_1.plainToClass(value, headers);
    const errors = await class_validator_1.validate(dto, { whitelist: true });
    if (errors.length > 0) {
        throw new common_1.BadRequestException(helpers_1.formatErrors(errors));
    }
    return dto;
});
//# sourceMappingURL=request-header.decorator.js.map