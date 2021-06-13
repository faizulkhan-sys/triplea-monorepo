export declare class ServiceBusSenderService {
    sendMessageToQueue(topicName: string, message: any, uniqueSessionID: any, uniqueReplyTo: any): Promise<void>;
    sendMessage(topicName: string, message: any): Promise<void>;
}
