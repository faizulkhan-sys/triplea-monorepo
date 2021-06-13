/* eslint-disable no-console */

import { ServiceBusClient } from '@azure/service-bus';

import { Injectable, Logger } from '@nestjs/common';
import * as config from '@config/index';
import { UserOperationService } from '@modules/user-operation/user-operation.service';

const connectionString = config.default.sbReceiverConnectionString;
const connectionStringTopic = config.default.sbReceiverConnectionStringTopic

const queueName = config.default.queueName;
const topicNameEnv = config.default.topicName;
const subscriptionName = config.default.subscriptionName;

@Injectable()
export class ServiceBusReceiverService {
  constructor(private readonly userOperationService: UserOperationService) {}

  /**
   * Function that receives message from Azure Service Bus
   *
   */

  async receiveMessageAsync() {
    const logger = new Logger('Receive Message DB Writer');

    try {
      const sbClient = new ServiceBusClient(connectionStringTopic, {
        retryOptions: { maxRetries: 1 },
      });
      /**
       * Initialize createReceiver Instance
       * Receive Mode: PeerLock
       * Message is not auto deleted from topic.
       * Message is only deleted once completeMessage() is called.
       * Note: Auto Delete is enabled on both peerLock and receiveAndDelete mode on receiving message through receiver.subscribe()
       */
      const receiver = sbClient.createReceiver(topicNameEnv, subscriptionName, {
        receiveMode: 'peekLock',
        maxAutoLockRenewalDurationInMs: 3000,
      });
      const messageList = receiver.getMessageIterator();

      /**
       * Using message iterator to receive message.
       * Note: Message is not auto deleted from topic. Message is only deleted once completeMessage() is called.
       */
      for await (const message of messageList) {
        const data = message.body.body;

        logger.log('SB Reponse' + JSON.stringify(data));

        switch (message.body.serviceType) {
          case 'user-create-notify-user-operation':
            logger.log('create user Notify operation');
            try {
              await this.userOperationService.sendUserCreateNotification(data);
              /**
               * Mark message as complete once all the data are stored on database.
               * Marking it complete removes the message from service bus topic.
               **/
              await receiver.completeMessage(message);
            } catch (err) {
              /**
               * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
               * ( Until and unless completeMessage() is called)
               **/
              await receiver.renewMessageLock(message);
            }

            logger.log('Message Removed From Service Bus..');
            break;
          case 'create-user-user-operation':
            logger.log('create user operation');
            try {
              await this.userOperationService.createUser(data);
              /**
               * Mark message as complete once all the data are stored on database.
               * Marking it complete removes the message from service bus topic.
               **/
              await receiver.completeMessage(message);
            } catch (err) {
              /**
               * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
               * ( Until and unless completeMessage() is called)
               **/
              await receiver.renewMessageLock(message);
            }

            logger.log('Message Removed From Service Bus..');
            break;
          case 'wrong-user-user-operation':
            logger.log('wrong user info auth');
            try {
              await this.userOperationService.wrongUserFound(data);
              /**
               * Mark message as complete once all the data are stored on database.
               * Marking it complete removes the message from service bus topic.
               **/
              await receiver.completeMessage(message);
            } catch (err) {
              /**
               * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
               * ( Until and unless completeMessage() is called)
               **/
              await receiver.renewMessageLock(message);
            }

            logger.log('Message Removed From Service Bus..');
            break;
            
            case 'contact-me-user-operation':
              logger.log('contact me info auth');
              try {
                await this.userOperationService.contactMe(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }
  
              logger.log('Message Removed From Service Bus..');
              break;

              case 'invite-employer-mobile-user-operation':
                logger.log('invite employer Mobile');
                try {
                  await this.userOperationService.invitemeployerMobile(data);
                  /**
                   * Mark message as complete once all the data are stored on database.
                   * Marking it complete removes the message from service bus topic.
                   **/
                  await receiver.completeMessage(message);
                } catch (err) {
                  /**
                   * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                   * ( Until and unless completeMessage() is called)
                   **/
                  await receiver.renewMessageLock(message);
                }
    
                logger.log('Message Removed From Service Bus..');
                break;

                case 'notify-employee-user-operation':
                  logger.log('notify employee Mobile');
                  try {
                    await this.userOperationService.setNotification(data);
                    /**
                     * Mark message as complete once all the data are stored on database.
                     * Marking it complete removes the message from service bus topic.
                     **/
                    await receiver.completeMessage(message);
                  } catch (err) {
                    /**
                     * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                     * ( Until and unless completeMessage() is called)
                     **/
                    await receiver.renewMessageLock(message);
                  }
      
                  logger.log('Message Removed From Service Bus..');
                  break;

                  case 'update-user-user-operation':
                  logger.log('update user Mobile');
                  try {
                    await this.userOperationService.updateUser(data);
                    /**
                     * Mark message as complete once all the data are stored on database.
                     * Marking it complete removes the message from service bus topic.
                     **/
                    await receiver.completeMessage(message);
                  } catch (err) {
                    /**
                     * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                     * ( Until and unless completeMessage() is called)
                     **/
                    await receiver.renewMessageLock(message);
                  }
      
                  logger.log('Message Removed From Service Bus..');
                  break;

                  case 'create-awaiting-approval-user-operation':
                    logger.log('Create user Mobile');
                    try {
                      await this.userOperationService.createAwaitUser(data);
                      /**
                       * Mark message as complete once all the data are stored on database.
                       * Marking it complete removes the message from service bus topic.
                       **/
                      await receiver.completeMessage(message);
                    } catch (err) {
                      /**
                       * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                       * ( Until and unless completeMessage() is called)
                       **/
                      await receiver.renewMessageLock(message);
                    }
        
                    logger.log('Message Removed From Service Bus..');
                    break;

            case 'delete-user-user-operation':
              logger.log('delete user Mobile');
              try {
                await this.userOperationService.deleteUser(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'verify-user-user-operation':
              logger.log('verify user operation');
              try {
                await this.userOperationService.verifyUserOperation(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'enable-disable-user-operation':
              logger.log('enable-disable user operation');
              try {
                await this.userOperationService.enableDisable(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;
            
            case 'set-fcm-user-operation':
              logger.log('set fcm user operation');
              try {
                await this.userOperationService.setFcm(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'add-change-mobile-number-user-operation':
              logger.log('add/change mobile no user operation');
              try {
                await this.userOperationService.addorChangeMobileNumber(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'request-sa-feature-user-operation':
              logger.log('request Sa Feature user operation');
              try {
                await this.userOperationService.requestSaFeature(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'reset-user-user-operation':
              logger.log('reset user operation');
              try {
                await this.userOperationService.resetUser(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'create-usertype-user-operation':
              logger.log('create usertype');
              try {
                await this.userOperationService.createUserType(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'delete-usertype-user-operation':
              logger.log('delete usertype');
              try {
                await this.userOperationService.deleteUserType(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'upadte-usertype-name-user-operation':
              logger.log('upadate usertype');
              try {
                await this.userOperationService.updateUserTypeName(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'verify-user-type-user-operation':
              logger.log('verify usertype');
              try {
                await this.userOperationService.VerifyUserType(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            case 'update-user-type-user-operation':
              logger.log('UPADTE usertype');
              try {
                await this.userOperationService.updateUserTypePermissions(data);
                /**
                 * Mark message as complete once all the data are stored on database.
                 * Marking it complete removes the message from service bus topic.
                 **/
                await receiver.completeMessage(message);
              } catch (err) {
                /**
                 * Retry within specific duration configured on service bus topic/subscription creation if message is not complete
                 * ( Until and unless completeMessage() is called)
                 **/
                await receiver.renewMessageLock(message);
              }

              logger.log('Message Removed From Service Bus..');
            break;

            default:
            logger.error(
              'Service Type: ' + message.body.serviceType + ' Not Found',
            );
            /**
             * Send Message to dead letter queue for future reference if service type not found
             **/
            await receiver.deadLetterMessage(message);
        }
      }
    } catch (error) {
      /**
       * TODO: Notify Operator on Connection lost
       **/
      logger.error(error);
      /**
       * Retry message if connection is lost with the service bus client
       **/
      this.receiveMessageAsync();
    }
  }
}
