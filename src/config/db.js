// MongoDB Configuration And Connection Utilities
const { MongoClient, ServerApiVersion } = require("mongodb");
const logger = require("../utils/logger");
require("dotenv").config();

// Validate Environment Variables And Fail Fast If Missing
["DB_USER", "DB_PASS", "DB_NAME"].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing Required Environment Variable: ${key}!`);
  }
});

// MongoDB Connection Uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@gopts.khyew0g.mongodb.net/?appName=GOPTS`;

// MongoClient Initialization And Configuration
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});

let dbInstance = null;

// Connect To MongoDB And Cache Database Instance
async function connectDB() {
  if (dbInstance) return dbInstance;

  try {
    await client.connect();
    dbInstance = client.db(process.env.DB_NAME);
    logger.info("MongoDB Connected!");
    return dbInstance;
  } catch (err) {
    logger.error({ err }, "MongoDB Connection Failed!");
    throw err;
  }
}

// Ensure Required Database Indexes Exist
async function ensureIndexes() {
  try {
    const db = await connectDB();

    // Users Collection Indexes
    const usersCollection = db.collection("users");
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ uid: 1 }, { unique: true });

    // Products Collection Indexes
    const productsCollection = db.collection("products");
    await productsCollection.createIndex({ category: 1 });
    await productsCollection.createIndex({ managerEmail: 1 });

    // Orders Collection Indexes
    const ordersCollection = db.collection("orders");
    await ordersCollection.createIndex({ trackingId: 1 }, { unique: true });
    await ordersCollection.createIndex({ userEmail: 1 });
    await ordersCollection.createIndex({ status: 1 });

    logger.info("Database Indexes Ensured!");
  } catch (err) {
    logger.fatal({ err }, "Failed To Ensure Database Indexes!");
    throw err;
  }
}

// Get Database Collection By Name
async function getCollection(name) {
  const db = await connectDB();
  return db.collection(name);
}

module.exports = {
  connectDB,
  ensureIndexes,
  getCollection,
  client,
};
