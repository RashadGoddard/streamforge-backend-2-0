/**
 * Database Config - Mongoose with sharding, retry, and connection pooling.
 */
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 100, // Scalability
      retryWrites: true,
      w: 'majority', // Write safety
    });
    logger.info('MongoDB sharded cluster online—data vault sealed.');
  } catch (error) {
    logger.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };