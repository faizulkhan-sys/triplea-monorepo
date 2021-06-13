import * as dotenv from 'dotenv';
import { decrypt } from '../utils/cipher';
import * as fs from 'fs';
import * as path from 'path';

let file = `${__dirname}/../../env/${process.env.NODE_ENV}.env`;

if (!fs.existsSync(path.resolve(file))) {
  file = `${__dirname}/../../env/dev.env`;
}
dotenv.config({ path: file, debug: false });

const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    access_expiry: Number(process.env.JWT_ACCESS_EXPIRY),
		refresh_expiry: Number(process.env.JWT_REFRESH_EXPIRY),
  },
  port: process.env.APP_PORT,
  db: {
    host: decrypt(JSON.parse(process.env.DB_HOST)),
    port: Number(decrypt(JSON.parse(process.env.DB_PORT))),
    username: decrypt(JSON.parse(process.env.DB_USERNAME)),
    password: decrypt(JSON.parse(process.env.DB_PASSWORD)),
    database: decrypt(JSON.parse(process.env.DB_DATABASE)),
  },
  kafkaBroker: process.env.KAFKA_BROKER,
  redisPort: Number(process.env.REDIS_PORT),
  redisHost: process.env.REDIS_HOST,
  mailConfig: {
    user: 'testrosebay@gmail.com',
    pass: 'fiqzfcqmertbketo',
  },
  queueName: process.env.QUEUE_NAME,
  topicName: process.env.TOPIC_NAME,
  subscriptionName: process.env.SUBSCRIPTION_NAME,
  mailService: 'gmail',
  minio: {
    port: Number(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucket: process.env.MINIO_BUCKET,
  },
  sbReceiverConnectionString: process.env.SERVICE_BUS_CONNECTION_STRING,
  sbReceiverConnectionStringTopic: process.env.SERVICE_BUS_CONNECTION_STRING_TOPIC,
  notificationChannel:process.env.NOTIFICATION_CHANNEL_DEV
};

console.info(config);
export default config;
