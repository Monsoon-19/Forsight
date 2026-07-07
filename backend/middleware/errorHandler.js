const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
