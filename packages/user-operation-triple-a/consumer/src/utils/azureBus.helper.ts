import { createServiceBusService } from 'azure-sb';

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.QUEUE_NAME;

export async function sendNotification(payload: any) {
  const connStr = connectionString;

  if (!connStr) throw new Error('Must provide connection string');

  const sbService = createServiceBusService(connStr);

  sbService.sendQueueMessage(
    queueName,
    JSON.stringify(payload),
    function (err) {
      if (err) {
        console.info('Failed Tx: ', err);
      } else {
        console.info('Sent ', payload);
      }
    },
  );
}
