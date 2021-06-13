/* eslint-disable no-console */

import { ServiceBusClient } from '@azure/service-bus';

import { Injectable, Logger } from '@nestjs/common';
import * as config from '@config/index';
import { EmployerAuthService } from '@modules/employer-auth/employer-auth.service';

// Service Bus Connection String
const connectionString = config.default.sbReceiverConnectionString;
const connectionStringTopic = config.default.sbReceiverConnectionStringTopic

const queueName = config.default.queueName;
const topicNameEnv = config.default.topicName;
const subscriptionName = config.default.subscriptionName;

@Injectable()
export class ServiceBusReceiverService {
  constructor(private readonly empAuthService: EmployerAuthService) {}

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
          case 'save-activity-log-employer-login':
            logger.log('Save Activity log Employer Auth');
            try {
              await this.empAuthService.loginEmployerSaveActivity(data);
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

          case 'update-activity-log-employer-login':
            logger.log('Update Activity log Employer Auth');
            try {
              await this.empAuthService.loginEmployerUpdateActivity(data);
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

          case 'update-user-repo-login':
            logger.log('update-user-repo-login');
            try {
              await this.empAuthService.loginUpdateUserAccount(data);
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
          
        case 'save-activity-log-user-login':
          logger.log('Save Activity log User Auth');
          try {
            await this.empAuthService.loginUserSaveActivity(data);
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
      
          case 'update-activity-log-user-login':
            logger.log('Update Activity log Employer Auth');
            try {
              await this.empAuthService.loginUserUpdateActivity(data);
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
          case 'set-password-employer-auth':
            logger.log('Set Password employer auth');
            try {
              await this.empAuthService.setPassword(data);
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

        
          case 'update-protocol-employer-auth':
            logger.log('update protocol employer auth');
            try {
              await this.empAuthService.updateProtocol(data);
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
           

            case 'add-update-settings-employer-auth':
              logger.log('Add Update Settings employer auth');
              try {
                await this.empAuthService.updateSettings(data);
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

              case 'forgot-password-employer-auth':
                logger.log('forgot password employer auth');
                try {
                  await this.empAuthService.forgotPassword(data);
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

                case 'reset-password-employer-auth':
                  logger.log('reset password employer auth');
                  try {
                    await this.empAuthService.resetPassword(data);
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

                  case 'change-password-employer-auth':
                    logger.log('change password employer auth');
                    try {
                      await this.empAuthService.changePassword(data);
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
