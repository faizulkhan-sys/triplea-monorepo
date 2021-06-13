/* eslint-disable no-await-in-loop */
import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { uniqueID } from '@utils/helpers';

import * as config from '../../config/index';

// Service Bus Connection String
const connectionString = config.default.sbSenderConnectionString;
const connectionStringTopic = config.default.sbSenderConnectionStringTopic;
// Max Retries
const maxRetries = config.default.sbSenderMaxRetries;
// Message to show during internal server error to user
const INTERNAL_SERVER_ERROR_MESSAGE = 'Something Went Wrong';

@Injectable()
export class ServiceBusSenderService {
  /**
   * Send Single Message to Service Bus Queue
   *
   * @param {string} topicName - The name of the topic to send message
   * @param {any} message - The json body to send on Azure Service Bus
   * @param {any} uniqueSessionID - session ID of queue to send on Azure Service Bus
   * @param {any} uniqueReplyTo - replyTo of queue to send on Azure Service Bus
   */
  async sendMessageToQueue(topicName: string, message: any, uniqueSessionID: any, uniqueReplyTo: any) {
    const logger = new Logger('ServiceBusSendMessage');

    logger.debug(connectionString);

    logger.log('Executing Send Message');
    const sbClient = new ServiceBusClient(connectionString, {
      retryOptions: { maxRetries: parseInt(maxRetries) },
    });

    // Create sender instance
    const sender = sbClient.createSender(topicName);

    const sbMessage: ServiceBusMessage = {
      body: message,
      sessionId: 'my-queue-session-employer',
      replyTo: uniqueReplyTo
    };

    logger.log('Message to send: ' + JSON.stringify(sbMessage));
    try {
      // Send Message to Service Bus
      await sender.sendMessages(sbMessage);
      logger.log('Message send successfully');
      await sender.close();
    } catch (err) {
      logger.error(err);
      throw new HttpException(
        INTERNAL_SERVER_ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      logger.log('Closing Service Bus Client');
      sbClient.close();
    }
  }

  /**
   * Send Single Message to Service Bus
   *
   * @param {string} topicName - The name of the topic to send message
   * @param {any} message - The json body to send on Azure Service Bus
   */
   async sendMessage(topicName: string, message: any) {
    const logger = new Logger('ServiceBusSendMessage');

    logger.debug(connectionStringTopic);

    logger.log('Executing Send Message');
    const sbClient = new ServiceBusClient(connectionStringTopic, {
      retryOptions: { maxRetries: parseInt(maxRetries) },
    });

    // Create sender instance
    const sender = sbClient.createSender(topicName);

    const sbMessage: ServiceBusMessage = {
      body: message,
      messageId: await uniqueID(),
    };

    logger.log('Message to send: ' + JSON.stringify(sbMessage));
    try {
      // Send Message to Service Bus
      await sender.sendMessages(sbMessage);
      logger.log('Message send successfully');
      await sender.close();
    } catch (err) {
      logger.error(err);
      throw new HttpException(
        INTERNAL_SERVER_ERROR_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      logger.log('Closing Service Bus Client');
      sbClient.close();
    }
  }
}
