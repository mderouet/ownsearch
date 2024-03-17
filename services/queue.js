const { QUEUE_NAME, START_URL } = require('../config/constants');
const crawlPage = require('./crawler');
const logger = require('../utils/logger');

async function startCrawler(db, esClient, channel) {
  try {
    logger.info(`Queuing initial URL: ${START_URL}`);
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(START_URL));

    logger.info('Starting to consume URLs from the queue');
    channel.consume(QUEUE_NAME, async (msg) => {
      await processMessage(msg, channel, db, esClient);
    }, { noAck: false });
  } catch (error) {
    logger.error('Error starting the crawler:', error);
  }
}

async function processMessage(msg, channel, db, esClient) {
  if (msg && msg.content) {
    const url = msg.content.toString();
    try {
      await crawlPage(url, db, esClient, channel);
      channel.ack(msg);
    } catch (error) {
      logger.error(`Error processing URL: ${url}`, error);
      channel.nack(msg, false, false);
    }
  } else {
    logger.warn('Received an empty message or missing content');
    channel.ack(msg);
  }
}

module.exports = startCrawler;