const { Client } = require('@elastic/elasticsearch');
const { ELASTICSEARCH_URL } = require('./constants');
const logger = require('../utils/logger');

async function connectToElasticsearch() {
  const client = new Client({ node: ELASTICSEARCH_URL });

  try {
    const health = await client.cluster.health();
    logger.info('Connecting to cluster health:', health.statusCode);
  } catch (error) {
    logger.error('Error connecting to Elasticsearch:', error);
    logger.error('Elasticsearch URL:', ELASTICSEARCH_URL);
    if (error.body) {
      logger.error('Error body:', error.body);
    }
    logger.error("Connection to elasticsearch couldn't be done")
    throw error;
  }

  return client;
}

module.exports = connectToElasticsearch;