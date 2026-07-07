const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const apiRoutes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const socketSetup = require('./sockets/index');
const metricsCollector = require('./services/metricsCollector');
const startCleanupJob = require('./jobs/cleanupJob');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For dev, allow all. In production, restrict to frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});
socketSetup(io);
metricsCollector.init(io);

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Start collector and cron jobs
metricsCollector.start();
startCleanupJob();

server.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
