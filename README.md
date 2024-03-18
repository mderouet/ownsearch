# Web Crawler and Search Engine

This project is a web crawler and search engine that crawls websites, indexes the content, and provides a search interface to retrieve relevant results.

## Features

- Crawls websites starting from a specified URL
- Fills a queue of link URLs using RabbitMQ
- Stores crawled page details in MongoDB
- Indexes page content using Elasticsearch
- Provides a REST API endpoint for searching keywords
- Implements a simple web interface for performing searches

## Prerequisites

Before running the project, make sure you have the following prerequisites installed:

- Docker
- Node (if you are not running the project using docker)

## Project Structure

```
.
├── Dockerfile
├── README.md
├── config
│   ├── constants.js
│   ├── elasticsearch.js
│   ├── mongodb.js
│   └── rabbitmq.js
├── docker-compose.yml
├── logs
├── nginx
│   └── default.conf
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

Sure! Here's the updated "Getting Started with Docker" section with fewer steps:

## Getting Started with Docker

To get started with the project using Docker, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/mderouet/ownsearch.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ownsearch
   ```

3. Open the `docker-compose.yml` file in a text editor and locate the `backend` service section.

4. Search for `START_URL` in the `docker-compose.yml` file environment variable section of the `backend` service to set the desired starting URL for the crawler:

   ```yaml
   environment:
     - START_URL=https://example.com
   ```

5. Start the application using Docker Compose:

   ```bash
   docker-compose up -d --build
   ```

   This command will build the Docker images and start the containers in detached mode.

6. The application will start crawling from the specified `START_URL`. You can check the logs to see which pages are being processed. Access the search interface by opening `http://localhost` in your web browser or use the REST API endpoint.

## Configuration

The application can be configured using environment variables. The `config/constants.js` file reads the environment variables from the `docker-compose.yml` file. If the environment variables are not set, it falls back to default values for local development.

The available configuration options are:

- `ELASTICSEARCH_URL`: URL for connecting to Elasticsearch.
- `ELASTICSEARCH_INDEX`: Name of the Elasticsearch index for storing crawled pages.
- `RABBITMQ_URL`: URL for connecting to RabbitMQ.
- `QUEUE_NAME`: Name of the RabbitMQ queue for crawling URLs.
- `DLX_NAME`: Name of the RabbitMQ dead letter exchange.
- `DLQ_NAME`: Name of the RabbitMQ dead letter queue.
- `MONGODB_URL`: URL for connecting to MongoDB.
- `MONGODB_DATABASE`: Name of the MongoDB database.
- `MONGODB_COLLECTION`: Name of the MongoDB collection for storing crawled pages.
- `START_URL`: Starting URL for the crawler.
- `CRAWLING_ENABLED`: Flag to enable or disable crawling.

## Usage

### Web Interface

The project provides a simple web interface for performing searches. To use the web interface:

1. Open `http://localhost` in your web browser.
2. Enter a keyword in the search input field.
3. Click the "Search" button or press Enter.
4. The search results will be displayed on the page.

### REST API

The application also provides a REST API endpoint for searching keywords. You can use tools like cURL or Postman to interact with the API.

Example cURL request:

```bash
curl -X GET "http://localhost:3000/search?keyword=example"
```

## Resetting the Environment

If you need to reset the entire environment, including stopping the Docker containers and removing the associated volumes, you can use the following command:

```bash
docker-compose down && docker volume prune --all
```

This command will stop and remove the Docker containers defined in the `docker-compose.yml` file and prune the unused volumes. Be cautious when using this command, as it will permanently delete the data stored in the volumes.
