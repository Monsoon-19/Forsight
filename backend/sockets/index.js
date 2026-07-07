const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../utils/logger');

const socketSetup = (io) => {
  const liveNs = io.of('/live');

  liveNs.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  liveNs.on('connection', (socket) => {
    logger.info(`Client connected to /live: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = socketSetup;
