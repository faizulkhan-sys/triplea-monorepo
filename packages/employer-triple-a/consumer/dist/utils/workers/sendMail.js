"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("threads/worker");
const notification_payload_1 = require("../../common/interfaces/notification.payload");
const common_1 = require("@nestjs/common");
const config = require("../../config/index");
const axios_1 = require("axios");
const logger = new common_1.Logger('SendMail');
const email = {
    async sendMail(to, mailTemplate, replacements, subject) {
        console.log('Inside Send mail before Axios call');
        const notificationObject = {
            sendTo: to,
            notificationHeader: subject,
            type: "notify",
            notificationBody: replacements,
            sendChannel: notification_payload_1.Channels.MAIL,
            template: mailTemplate
        };
        console.log('Inside Send mail before Axios call');
        console.log('Axios call to URL -> ' + config.default.notificationChannel);
        const headers = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        const response = await axios_1.default.post(config.default.notificationChannel, JSON.stringify(notificationObject), {
            headers: headers
        })
            .then((response) => {
            console.log("notificationObject sent to sendChannel");
        })
            .catch((error) => {
            console.log(error);
        });
    },
};
worker_1.expose(email);
//# sourceMappingURL=sendMail.js.map