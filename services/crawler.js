const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const { ELASTICSEARCH_INDEX, QUEUE_NAME, REGEX_URL } = require('../config/constants');
const logger = require('../utils/logger');

async function processLink(link, url, db, channel) {
  try {
    const parsedLink = new URL(link.href, url);
    const absoluteLink = parsedLink.href;
    const urlOrigin = parsedLink.origin;
    const pathname = parsedLink.pathname;

    // Check if the link matches the regex pattern
    if (!REGEX_URL.test(absoluteLink)) {
      logger.verbose(`Discarding link: ${absoluteLink} (Doesn't match the regex)`);
      return;
    }

    // Check if the link already exists in the database
    const existingPage = await db.collection('pages').findOne({
      url: urlOrigin,
      pathname: pathname,
    });

    if (!existingPage) {
      // Insert the URL, sub-URL, and title into the database
      await db.collection('pages').insertOne({
        url: urlOrigin,
        pathname: pathname,
        title: link.title,
        processed: false,
      });

      await channel.sendToQueue(QUEUE_NAME, Buffer.from(absoluteLink));
      logger.info(`Added link to queue: ${absoluteLink}`);
    } else {
      logger.verbose(`Link already exists in database: ${absoluteLink}`);
    }
  } catch (error) {
    logger.error(`Invalid URL: ${error}`);
  }
}

async function crawlPage(url, db, esClient, channel) {
  try {
    logger.info(`Crawling page: ${url}`);
    const response = await axios.get(url, {
      timeout: 1000,
    });
    const $ = cheerio.load(response.data);

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');

    // Parse the decoded URL to extract url and pathname
    const parsedUrl = new URL(url);
    const urlOrigin = parsedUrl.origin;
    const pathname = parsedUrl.pathname;

    // Check if the page already exists in the database
    const existingPage = await db.collection('pages').findOne({
      url: urlOrigin,
      pathname: pathname,
    });

    if (existingPage) {
      // Update the existing page with the new data and set processed to true
      await db.collection('pages').updateOne(
        { _id: existingPage._id },
        {
          $set: {
            title,
            description,
            processed: true,
          },
        }
      );
    } else {
      // Insert a new page into the database and set processed to true
      await db.collection('pages').insertOne({
        url: urlOrigin,
        pathname,
        title,
        description,
        processed: true,
      });
    }

    // Index data in Elasticsearch
    await esClient.index({
      index: ELASTICSEARCH_INDEX,
      body: {
        url: urlOrigin,
        pathname,
        title,
        description,
      },
    });

    // Process extracted links
    const links = $('a')
      .map((_, a) => ({
        href: $(a).attr('href'),
        title: $(a).attr('title'),
      }))
      .get();

    for (const link of links) {
      await processLink(link, url, db, channel);
    }

  } catch (error) {
    logger.error("Error while crawling page: ", error);
  }
}

module.exports = crawlPage;