const cron = require('node-cron');
const Metric = require('../models/Metric');
const logger = require('../utils/logger');

const startCleanupJob = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const result = await Metric.deleteMany({ timestamp: { $lt: twentyFourHoursAgo } });
      logger.info(`Cleanup Job: Deleted ${result.deletedCount} old metrics`);
    } catch (error) {
      logger.error('Cleanup Job Error:', error);
    }
  });
  logger.info('Cleanup job scheduled');
};

module.exports = startCleanupJob;
