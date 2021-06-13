"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto = require("crypto");
const password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY', iv = '60iP0h6vJoEa';
function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-gcm', password, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return {
        content: encrypted,
        tag: tag.toString('hex'),
    };
}
exports.encrypt = encrypt;
function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', password, iv);
    decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));
    let dec = decipher.update(encrypted.content, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.decrypt = decrypt;
console.info(encrypt('orbis_dev_test'));
//# sourceMappingURL=cipher.js.map