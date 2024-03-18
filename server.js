const connectToMongoDB = require('./config/mongodb');
const connectToRabbitMQ = require('./config/rabbitmq');
const connectToElasticsearch = require('./config/elasticsearch');
const startCrawler = require('./services/queue');
const logger = require('./utils/logger');
const { ELASTICSEARCH_INDEX, CRAWLING_ENABLED } = require('./config/constants');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

async function main() {
  try {
    logger.info('Connecting to MongoDB');
    const db = await connectToMongoDB();
    logger.info('Connecting to RabbitMQ');
    const channel = await connectToRabbitMQ();
    logger.info('Connecting to Elasticsearch');
    const esClient = await connectToElasticsearch();

    if (CRAWLING_ENABLED) {
      logger.info('Starting the crawler');
      startCrawler(db, esClient, channel);
    } else {
      logger.info('Crawler is not activated');
    }

    app.get('/search', async (req, res) => {
      const { keyword, size = 30 } = req.query;

      try {
        const searchResult = await esClient.search({
          index: ELASTICSEARCH_INDEX,
          body: {
            query: {
              multi_match: {
                query: keyword,
                fields: ['title', 'description'],
              },
            },
          },
          size: parseInt(size),
        });

        const hits = searchResult.body.hits.hits;
        const results = hits.map((hit) => hit._source);

        res.json(results);
      } catch (error) {
        logger.error('Error searching in Elasticsearch:', error);
        res.status(500).json({ error: 'An error occurred while searching' });
      }
    });

    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info(`REST Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Error starting the application:', error);
  }
}

main().catch(console.error);