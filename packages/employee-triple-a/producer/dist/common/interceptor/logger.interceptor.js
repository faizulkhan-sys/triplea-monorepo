"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.ctxPrefix = LoggingInterceptor_1.name;
        this.logger = new common_1.Logger(this.ctxPrefix);
        this.userPrefix = '';
    }
    setUserPrefix(prefix) {
        this.userPrefix = `${prefix} - `;
    }
    intercept(context, call$) {
        const req = context.switchToHttp().getRequest();
        const { method, url, body, headers } = req;
        const ctx = `${this.userPrefix}${this.ctxPrefix} - ${method} - ${url}`;
        const message = `Request - ${method} - ${url}`;
        this.logger.log({
            message,
            method,
            body,
            headers,
        }, ctx);
        return call$.handle().pipe(operators_1.tap({
            next: (val) => {
                this.logNext(val, context);
            },
            error: (err) => {
                this.logError(err, context);
            },
        }));
    }
    logNext(body, context) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        const { method, url } = req;
        const { statusCode } = res;
        const ctx = `${this.userPrefix}${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
        const message = `Response - ${statusCode} - ${method} - ${url}`;
        this.logger.log({
            message,
            body,
        }, ctx);
    }
    logError(error, context) {
        const req = context.switchToHttp().getRequest();
        const { method, url, body } = req;
        if (error instanceof common_1.HttpException) {
            const statusCode = error.getStatus();
            const ctx = `${this.userPrefix}${this.ctxPrefix} - ${statusCode} - ${method} - ${url}`;
            const message = `Response - ${statusCode} - ${method} - ${url}`;
            if (statusCode >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                this.logger.error({
                    method,
                    url,
                    body,
                    message,
                    error,
                }, error.stack, ctx);
            }
            else {
                this.logger.warn({
                    method,
                    url,
                    error,
                    body,
                    message,
                }, ctx);
            }
        }
        else {
            this.logger.error({
                message: `Response - ${method} - ${url}`,
            }, error.stack, `${this.userPrefix}${this.ctxPrefix} - ${method} - ${url}`);
        }
    }
};
LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    common_1.Injectable()
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logger.interceptor.js.map