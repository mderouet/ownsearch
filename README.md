# Web Crawler and Search Engine

This project is a web crawler and search engine that crawls websites, indexes the content, and provides a search interface to retrieve relevant results.

## Features

- Crawls websites starting from a specified URL
- Stores crawled pages in MongoDB
- Indexes page content using Elasticsearch
- Provides a REST API endpoint for searching keywords
- Implements a simple web interface for performing searches

## Prerequisites

Before running the project, make sure you have the following prerequisites installed:

- Node.js (version 21.7.1)
- Docker

## Project Structure

```
.
├── README.md
├── config
│   ├── constants.js
│   ├── elasticsearch.js
│   ├── mongodb.js
│   └── rabbitmq.js
├── docker-compose.yml
├── logs
│   ├── combined.log
│   ├── error.log
│   └── verbose.log
├── package-lock.json
├── package.json
├── server.js
├── services
│   ├── crawler.js
│   └── queue.js
├── site
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── utils
    └── logger.js
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/mderouet/ownsearch.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ownsearch
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the required services using Docker Compose:

   ```bash
   docker-compose up -d
   ```

5. Configure the application by modifying the `config/constants.js` file:
   - Default configuration should do the trick for RabbitMQ, Elasticsearch, and MongoDB.
   - Adjust the start URL to your preference

6. Start the application:

   ```bash
   npm start
   ```

7. Access the search interface by opening `index.html` in your web browser or use the REST API endpoint.

## Usage

### Web Interface

The project provides a simple web interface for performing searches. To use the web interface:

1. Open the `index.html` file in your web browser.
2. Enter a keyword in the search input field.
3. Click the "Search" button or press Enter.
4. The search results will be displayed on the page.

### REST API

The application also provides a REST API endpoint for searching keywords. You can use tools like cURL or Postman to interact with the API.

Example cURL request:

```bash
curl -X GET "http://localhost:3000/search?keyword=example"
```

## Configuration

The application can be configured using the `config/constants.js` file. The following options are available:

- `RABBITMQ_URL`: URL for connecting to RabbitMQ.
- `QUEUE_NAME`: Name of the RabbitMQ queue for crawling URLs.
- `DLX_NAME`: Name of the RabbitMQ dead letter exchange.
- `DLQ_NAME`: Name of the RabbitMQ dead letter queue.
- `MAX_RETRIES`: Maximum number of retries for failed crawling attempts.
- `ELASTICSEARCH_INDEX`: Name of the Elasticsearch index for storing crawled pages.
- `ELASTICSEARCH_URL`: URL for connecting to Elasticsearch.
- `MONGODB_URL`: URL for connecting to MongoDB.
- `MONGODB_DATABASE`: Name of the MongoDB database.
- `MONGODB_COLLECTION`: Name of the MongoDB collection for storing crawled pages.
- `REGEX_URL`: Regular expression for filtering URLs to crawl.
- `START_URL`: Starting URL for the crawler.
- `CRAWLING_ENABLED`: Flag to enable or disable crawling.