"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("threads/worker");
const argon2_1 = require("argon2");
const password = {
    hashString(value) {
        return argon2_1.hash(value, {
            type: argon2_1.argon2d,
            hashLength: 50,
            saltLength: 32,
            timeCost: 4,
        });
    },
};
worker_1.expose(password);
//# sourceMappingURL=password.js.map