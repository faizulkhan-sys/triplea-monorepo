declare const config: {
    jwt: {
        secret: string;
        access_expiry: number;
        refresh_expiry: number;
        expiresIn: number;
    };
    port: number;
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        key: string;
        iv: string;
    };
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
    sbSenderConnectionString: string;
    sbSenderConnectionStringTopic: string;
    queueName: string;
    topicName: string;
    sbSenderMaxRetries: string;
};
export default config;
