"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const index_1 = require("../../config/index");
let AuthGuard = class AuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;
        if (!token) {
            throw new common_1.HttpException('Token not found in request', common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            const decoded = jwt.verify(token.split(' ')[1], index_1.default.jwt.secret);
            request.idx = decoded.idx;
            return true;
        }
        catch (e) {
            if ((e === null || e === void 0 ? void 0 : e.name) === 'TokenExpiredError') {
                throw new common_1.UnprocessableEntityException('The session has expired. Please relogin');
            }
            else {
                throw new common_1.UnprocessableEntityException('Token malformed');
            }
        }
    }
};
AuthGuard = __decorate([
    common_1.Injectable()
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map