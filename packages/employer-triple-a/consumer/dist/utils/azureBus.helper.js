"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const azure_sb_1 = require("azure-sb");
const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;
async function sendNotification(payload) {
    const connStr = connectionString;
    if (!connStr)
        throw new Error('Must provide connection string');
    const sbService = azure_sb_1.createServiceBusService(connStr);
    sbService.sendQueueMessage(queueName, JSON.stringify(payload), function (err) {
        if (err) {
            console.info('Failed Tx: ', err);
        }
        else {
            console.info('Sent ', payload);
        }
    });
}
exports.sendNotification = sendNotification;
//# sourceMappingURL=azureBus.helper.js.map