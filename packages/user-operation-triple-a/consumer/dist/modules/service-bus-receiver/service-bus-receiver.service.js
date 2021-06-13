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
const user_operation_service_1 = require("../user-operation/user-operation.service");
const connectionString = config.default.sbReceiverConnectionString;
const connectionStringTopic = config.default.sbReceiverConnectionStringTopic;
const queueName = config.default.queueName;
const topicNameEnv = config.default.topicName;
const subscriptionName = config.default.subscriptionName;
let ServiceBusReceiverService = class ServiceBusReceiverService {
    constructor(userOperationService) {
        this.userOperationService = userOperationService;
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
                        case 'user-create-notify-user-operation':
                            logger.log('create user Notify operation');
                            try {
                                await this.userOperationService.sendUserCreateNotification(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'create-user-user-operation':
                            logger.log('create user operation');
                            try {
                                await this.userOperationService.createUser(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'wrong-user-user-operation':
                            logger.log('wrong user info auth');
                            try {
                                await this.userOperationService.wrongUserFound(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'contact-me-user-operation':
                            logger.log('contact me info auth');
                            try {
                                await this.userOperationService.contactMe(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'invite-employer-mobile-user-operation':
                            logger.log('invite employer Mobile');
                            try {
                                await this.userOperationService.invitemeployerMobile(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'notify-employee-user-operation':
                            logger.log('notify employee Mobile');
                            try {
                                await this.userOperationService.setNotification(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'update-user-user-operation':
                            logger.log('update user Mobile');
                            try {
                                await this.userOperationService.updateUser(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'create-awaiting-approval-user-operation':
                            logger.log('Create user Mobile');
                            try {
                                await this.userOperationService.createAwaitUser(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'delete-user-user-operation':
                            logger.log('delete user Mobile');
                            try {
                                await this.userOperationService.deleteUser(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'verify-user-user-operation':
                            logger.log('verify user operation');
                            try {
                                await this.userOperationService.verifyUserOperation(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'enable-disable-user-operation':
                            logger.log('enable-disable user operation');
                            try {
                                await this.userOperationService.enableDisable(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'set-fcm-user-operation':
                            logger.log('set fcm user operation');
                            try {
                                await this.userOperationService.setFcm(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'add-change-mobile-number-user-operation':
                            logger.log('add/change mobile no user operation');
                            try {
                                await this.userOperationService.addorChangeMobileNumber(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'request-sa-feature-user-operation':
                            logger.log('request Sa Feature user operation');
                            try {
                                await this.userOperationService.requestSaFeature(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'reset-user-user-operation':
                            logger.log('reset user operation');
                            try {
                                await this.userOperationService.resetUser(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'create-usertype-user-operation':
                            logger.log('create usertype');
                            try {
                                await this.userOperationService.createUserType(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'delete-usertype-user-operation':
                            logger.log('delete usertype');
                            try {
                                await this.userOperationService.deleteUserType(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'upadte-usertype-name-user-operation':
                            logger.log('upadate usertype');
                            try {
                                await this.userOperationService.updateUserTypeName(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'verify-user-type-user-operation':
                            logger.log('verify usertype');
                            try {
                                await this.userOperationService.VerifyUserType(data);
                                await receiver.completeMessage(message);
                            }
                            catch (err) {
                                await receiver.renewMessageLock(message);
                            }
                            logger.log('Message Removed From Service Bus..');
                            break;
                        case 'update-user-type-user-operation':
                            logger.log('UPADTE usertype');
                            try {
                                await this.userOperationService.updateUserTypePermissions(data);
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
    __metadata("design:paramtypes", [user_operation_service_1.UserOperationService])
], ServiceBusReceiverService);
exports.ServiceBusReceiverService = ServiceBusReceiverService;
//# sourceMappingURL=service-bus-receiver.service.js.map