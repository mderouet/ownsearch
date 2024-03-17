module.exports = {
  RABBITMQ_URL: 'amqp://localhost',
  QUEUE_NAME: 'crawl_urls',
  DLX_NAME: 'crawl_dlx',
  DLQ_NAME: 'crawl_failures',
  MAX_RETRIES: 3,
  ELASTICSEARCH_INDEX: 'crawled_pages',
  ELASTICSEARCH_URL: 'http://localhost:9200',
  MONGODB_URL: 'mongodb://localhost:27017',
  MONGODB_DATABASE: 'crawler',
  MONGODB_COLLECTION: 'pages',
  // REGEX_URL: /wikipedia/i,
  REGEX_URL: /(?:)/,
  START_URL: "https://jeuxvideo.com/",
  CRAWLING_ENABLED: true
};