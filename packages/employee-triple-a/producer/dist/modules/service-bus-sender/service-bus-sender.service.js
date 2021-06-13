"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBusSenderService = void 0;
const service_bus_1 = require("@azure/service-bus");
const common_1 = require("@nestjs/common");
const helpers_1 = require("../../utils/helpers");
const index_1 = require("../../config/index");
const connectionString = index_1.default.sbSenderConnectionString;
const connectionStringTopic = index_1.default.sbSenderConnectionStringTopic;
const maxRetries = index_1.default.sbSenderMaxRetries;
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';
let ServiceBusSenderService = class ServiceBusSenderService {
    async sendMessageToQueue(topicName, message, uniqueSessionID, uniqueReplyTo) {
        const logger = new common_1.Logger('ServiceBusSendMessage');
        logger.debug('Connection String : ' + connectionString);
        logger.log('Executing Send Message');
        const sbClient = new service_bus_1.ServiceBusClient(connectionString, {
            retryOptions: { maxRetries: parseInt(maxRetries) },
        });
        logger.log('Create Sender for queue : ' + JSON.stringify(topicName));
        const sender = sbClient.createSender(topicName);
        logger.log('Preparing Message to send over queue');
        const sbMessage = {
            body: message,
            sessionId: 'my-queue-session',
            replyTo: uniqueReplyTo
        };
        logger.log('Message to send: ' + JSON.stringify(sbMessage));
        try {
            await sender.sendMessages(sbMessage);
            logger.log('Message send successfully');
            await sender.close();
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            logger.log('Closing Service Bus Client');
        }
    }
    async sendMessage(topicName, message) {
        const logger = new common_1.Logger('ServiceBusSendMessage');
        logger.debug(connectionStringTopic);
        logger.log('Executing Send Message');
        const sbClient = new service_bus_1.ServiceBusClient(connectionStringTopic, {
            retryOptions: { maxRetries: parseInt(maxRetries) },
        });
        const sender = sbClient.createSender(topicName);
        const sbMessage = {
            body: message,
            messageId: await helpers_1.uniqueID(),
        };
        logger.log('Message to send: ' + JSON.stringify(sbMessage));
        try {
            await sender.sendMessages(sbMessage);
            logger.log('Message send successfully');
            await sender.close();
        }
        catch (err) {
            logger.error(err);
            throw new common_1.HttpException(INTERNAL_SERVER_ERROR_MESSAGE, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            logger.log('Closing Service Bus Client');
            sbClient.close();
        }
    }
};
ServiceBusSenderService = __decorate([
    common_1.Injectable()
], ServiceBusSenderService);
exports.ServiceBusSenderService = ServiceBusSenderService;
//# sourceMappingURL=service-bus-sender.service.js.map