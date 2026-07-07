const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.name === 'MongooseServerSelectionError') {
      logger.warn('Local MongoDB connection refused. Falling back to in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      logger.info(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } else {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
