const { MongoClient } = require('mongodb');
const { MONGODB_URL, MONGODB_DATABASE } = require('./constants');

async function connectToMongoDB() {
  const client = await MongoClient.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DATABASE);

  // Indexes
  await db.collection('pages').createIndex({ url: 1, pathname: 1 });

  return db;
}

module.exports = connectToMongoDB;