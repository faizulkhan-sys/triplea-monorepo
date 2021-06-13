"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBusReceiverService = void 0;
const service_bus_1 = require("@azure/service-bus");
const common_1 = require("@nestjs/common");
const config = require("../../config/index");
const employer_auth_service_1 = require("../employer-auth/employer-auth.service");
const connectionString = config.default.sbReceiverConnectionString;
const connectionStringTopic = config.default.sbReceiverConnectionStringTopic;
const queueName = config.default.queueName;
const topicNameEnv = config.default.topicName;
const subscriptionName = config.default.subscriptionName;
let ServiceBusReceiverService = class ServiceBusReceiverService {
    constructor(empAuthService) {
        this.empAuthService = empAuthService;
    }
    async receiveMessageAsync() {
        var e_1, _a;
        const logger = new common_1.Logger('Receive Message DB Writer');
        try {
            const sbClient = new service_bus_1.ServiceBusClient(connectionStringTopic, {
                retryOptions: { maxRetries: 1 },
            });
            const receiver = sbClient.createReceiver(topicNameEnv, subscriptionName, {
                receiveMode: 'peekLock',
                maxAutoLockRenewalDurationInMs: 3000,
            });
            const messageList = receiver.getMessageIterator();
            try {
                for (var messageList_1 = __asyncValues(messageList), messageList_1_1; messageList_1_1 = await messageList_1.next(), !messageList_1_1.done;) {
                    const message = messageList_1_1.value;
                    const data = message.body.body;
                    logger.log('SB Reponse' + JSON.stringify(data));
                    switch (message.body.serviceType) {
                        case 'save-activity-log-employer-login':
                            logger.log('Save Activity log Employer Auth');
                            try {
                                await this.empAuthService.loginEmployerSaveActivity(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'update-activity-log-employer-login':
                            logger.log('Update Activity log Employer Auth');
                            try {
                                await this.empAuthService.loginEmployerUpdateActivity(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'update-user-repo-login':
                            logger.log('update-user-repo-login');
                            try {
                                await this.empAuthService.loginUpdateUserAccount(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'save-activity-log-user-login':
                            logger.log('Save Activity log User Auth');
                            try {
                                await this.empAuthService.loginUserSaveActivity(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'update-activity-log-user-login':
                            logger.log('Update Activity log Employer Auth');
                            try {
                                await this.empAuthService.loginUserUpdateActivity(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'set-password-employer-auth':
                            logger.log('Set Password employer auth');
                            try {
                                await this.empAuthService.setPassword(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'update-protocol-employer-auth':
                            logger.log('update protocol employer auth');
                            try {
                                await this.empAuthService.updateProtocol(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'add-update-settings-employer-auth':
                            logger.log('Add Update Settings employer auth');
                            try {
                                await this.empAuthService.updateSettings(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'forgot-password-employer-auth':
                            logger.log('forgot password employer auth');
                            try {
                                await this.empAuthService.forgotPassword(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'reset-password-employer-auth':
                            logger.log('reset password employer auth');
                            try {
                                await this.empAuthService.resetPassword(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'change-password-employer-auth':
                            logger.log('change password employer auth');
                            try {
                                await this.empAuthService.changePassword(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        default:
                            logger.error('Service Type: ' + message.body.serviceType + ' Not Found');
                            await receiver.deadLetterMessage(message);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messageList_1_1 && !messageList_1_1.done && (_a = messageList_1.return)) await _a.call(messageList_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            logger.error(error);
            this.receiveMessageAsync();
        }
    }
};
ServiceBusReceiverService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [employer_auth_service_1.EmployerAuthService])
], ServiceBusReceiverService);
exports.ServiceBusReceiverService = ServiceBusReceiverService;
//# sourceMappingURL=service-bus-receiver.service.js.map