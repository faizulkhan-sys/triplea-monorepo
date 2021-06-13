"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const nest_winston_1 = require("nest-winston");
const infoAndWarnFilter = winston.format((info, _) => {
    return info.level === 'info' || info.level === 'warn' ? info : false;
});
const errorFilter = winston.format((info, _) => {
    return info.level === 'error' ? info : false;
});
let transports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike()),
    }),
];
if (process.env.NODE_ENV === 'prod') {
    transports = [
        ...transports,
        new winston.transports.File({
            filename: 'logs/info.log',
            level: 'info',
            zippedArchive: true,
            maxsize: 100 * Math.pow(1024, 2),
            format: winston.format.combine(infoAndWarnFilter()),
        }),
        new dailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: 100 * Math.pow(1024, 2),
            maxFiles: '14d',
            level: 'error',
            format: winston.format.combine(errorFilter()),
        }),
    ];
}
exports.default = transports;
//# sourceMappingURL=winstonTransports.js.map