"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestSanitizerInterceptor = void 0;
const validator_1 = require("validator");
class RequestSanitizerInterceptor {
    constructor() {
        this.except = ['password', 'captcha'];
    }
    intercept(context, next) {
        this.cleanRequest(context.switchToHttp().getRequest());
        return next.handle();
    }
    cleanRequest(req) {
        req.query = this.cleanObject(req.query);
        req.params = this.cleanObject(req.params);
        if (req.method !== 'GET' || req.method !== 'DELETE') {
            req.body = this.cleanObject(req.body);
        }
    }
    cleanObject(obj) {
        if (!obj) {
            return obj;
        }
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'object') {
                this.cleanObject(value);
            }
            else {
                obj[key] = this.transform(key, value);
            }
        }
        return obj;
    }
    transform(key, value) {
        if (this.isString(value) &&
            this.isString(key) &&
            this.except.find(el => el.includes(key))) {
            return validator_1.default.trim(escape(value));
        }
        return value;
    }
    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
}
exports.RequestSanitizerInterceptor = RequestSanitizerInterceptor;
//# sourceMappingURL=requestSanitizer.interceptor.js.map