declare const config: {
    jwt: {
        secret: string;
        access_expiry: number;
        refresh_expiry: number;
    };
    port: string;
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        key: string;
        iv: string;
    };
    kafkaBroker: string;
    redisPort: number;
    redisHost: string;
    mailConfig: {
        user: string;
        pass: string;
    };
    mailService: string;
    minio: {
        port: number;
        accessKey: string;
        secretKey: string;
        bucket: string;
    };
    sbReceiverConnectionString: string;
    sbReceiverConnectionStringTopic: string;
    topicName: string;
    queueName: string;
    notificationChannel: string;
    subscriptionName: string;
};
export default config;
