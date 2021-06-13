"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIdx = void 0;
const common_1 = require("@nestjs/common");
exports.GetIdx = common_1.createParamDecorator((data, ctx) => {
    return ctx.switchToHttp().getRequest().idx;
});
//# sourceMappingURL=GetIdx.js.map