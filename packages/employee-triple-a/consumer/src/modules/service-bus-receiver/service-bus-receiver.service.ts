/* eslint-disable no-console */
import { ServiceBusClient } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';
import * as config from '@config/index';
import { EmployeeAuthService } from '@modules/employee-auth/employee-auth.service';

// Service Bus Connection String
const connectionString = config.default.sbReceiverConnectionString;
const connectionStringTopic = config.default.sbReceiverConnectionStringTopic

const queueName = config.default.queueName;
const topicNameEnv = config.default.topicName;
const subscriptionName = config.default.subscriptionName;

@Injectable()
export class ServiceBusReceiverService {
  constructor(private readonly empAuthService: EmployeeAuthService) {}
  
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
      const receiver = await sbClient.createReceiver(topicNameEnv, subscriptionName, {
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

          case 'save-activity-log-employee-login':
            logger.log('login db employee auth');
            try {
              await this.empAuthService.loginEmployeeSaveActivity(data);
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
          
          case 'save-activity-log-false-employee-login':
            logger.log('login db employee false case auth');
            try {
              await this.empAuthService.loginEmployeeSaveActivityForFailed(data);
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

          case 'update-activity-log-employee-login':
            logger.log('update activity log employer login');
            try {
              await this.empAuthService.loginEmployeeUpdateActivity(data);
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

          case 'update-employee-repo-login':
            logger.log('update-user-repo-login');
            try {
              await this.empAuthService.loginUpdateEmployeeAccount(data);
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
          case 'reset-mpin-employee-auth':
            logger.log('Reset mpin employee auth');
            try {
              await this.empAuthService.resetMpin(data);
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

          
          case 'forget-mpin-employee-auth':
            logger.log('Forgot mpin employee auth');
            try {
              await this.empAuthService.forgetMpin(data);
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
          
            case 'change-mpin-employee-auth':
              logger.log('Change mpin employee auth');
              try {
                await this.empAuthService.changeMpin(data);
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
            case 'change-password-employee-auth':
              logger.log('Change password employee auth');
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
            case 'reset-password-employee-auth':
              logger.log('Reset password employee auth');
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
            case 'verify-mpin-employee-auth':
              logger.log('Verify mpin employee auth');
              try {
                await this.empAuthService.verifyMpin(data);
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
            
            case 'set-mpin-employee-auth':
              logger.log('Set mpin employee auth');
              try {
                await this.empAuthService.setMpin(data);
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
            case 'forgot-password-employee-auth':
              logger.log('Forgot password employee auth');
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
              case 'signup-employee-auth':
                logger.log('signup employee auth');
                try {
                  await this.empAuthService.signupEmployee(data);
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


                case 'create-filter-employee-auth':
                  logger.log('create-filter-employee-auth');
                  try {
                    await this.empAuthService.createFilter(data);
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

                  case 'update-filter-employee-auth':
                    logger.log('update-filter-employee-auth');
                    try {
                      await this.empAuthService.upadateFilter(data);
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


                    case 'delete-filter-employee-auth':
                      logger.log('delete-filter-employee-auth');
                      try {
                        await this.empAuthService.deleteFilter(data);
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
