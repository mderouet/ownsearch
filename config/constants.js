module.exports = {
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX || 'crawled_pages',
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
  QUEUE_NAME: process.env.QUEUE_NAME || 'crawl_urls',
  DLX_NAME: process.env.DLX_NAME || 'crawl_dlx',
  DLQ_NAME: process.env.DLQ_NAME || 'crawl_failures',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || 'crawler',
  MONGODB_COLLECTION: process.env.MONGODB_COLLECTION || 'pages',
  START_URL: process.env.START_URL || "https://cryptoast.fr//",
  REGEX_URL: /(?:)/,
  CRAWLING_ENABLED: process.env.CRAWLING_ENABLED === 'true' || true
};