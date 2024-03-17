const amqp = require('amqplib');
const { RABBITMQ_URL, QUEUE_NAME, DLX_NAME, DLQ_NAME } = require('./constants');

async function connectToRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Assert the dead-letter exchange
  await channel.assertExchange(DLX_NAME, 'direct', { durable: true });

  // Assert the dead-letter queue and bind it to the dead-letter exchange
  await channel.assertQueue(DLQ_NAME, {
    durable: true
  });
  await channel.bindQueue(DLQ_NAME, DLX_NAME, DLQ_NAME);

  // Assert the main queue with dead-letter exchange and routing key configuration
  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
    deadLetterExchange: DLX_NAME,
    deadLetterRoutingKey: DLQ_NAME
  });

  // Set the prefetch count to 1 to process messages one at a time
  channel.prefetch(1);

  return channel;
}

module.exports = connectToRabbitMQ;