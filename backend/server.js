/**
 * StreamForge 2.0 Backend - Cosmic hub with gRPC, Istio, blockchain logging.
 * Scales across clouds, evades DSPs with AI transformer.
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const { createServer } = require('http');
const { grpc } = require('@grpc/grpc-js'); // For iOS gRPC client
const promClient = require('prom-client');
const { logger } = require('./utils/logger');
const { connectDB } = require('./config/database');
const { initBlockchain } = require('./config/blockchain');
const { authRoutes } = require('./routes/auth');
const { streamRoutes } = require('./routes/streams');
const { analyticsRoutes } = require('./routes/analytics');
const { trendsRoutes } = require('./routes/trends');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

// Metrics for Prometheus
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Init app
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] } },
}));
app.use(cors({ origin: process.env.APP_URL || 'https://streamforge.app' }));
app.use(express.json({ limit: '10mb' }));

// Connect DB and blockchain
Promise.all([connectDB(), initBlockchain()])
  .then(() => logger.info('DB & Blockchain forged—cosmos aligned.'))
  .catch(err => {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/trends', trendsRoutes);

// Health + Metrics
app.get('/health', (req, res) => res.status(200).json({ status: 'Divine', uptime: process.uptime() }));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Error handler
app.use(errorHandler);

// AI Evolution Cron - Every 4 hours, refine transformer model
cron.schedule('0 */4 * * *', async () => {
  const { botEngine } = require('./services/botEngine');
  await botEngine.evolveModel();
  logger.info('AI Transformer ascended—new ploys forged.');
});

// Ignite with gRPC support
server.listen(PORT, () => {
  logger.info(`StreamForge 2.0 ablaze on port ${PORT}. Cosmos trembles.`);
});

// gRPC for iOS low-latency
// Protobuf definition: see /proto/streamforge.proto
const grpcServer = new grpc.Server();
// Load proto and bind (omitted for brevity; define in /proto)
grpcServer.bindAsync(`0.0.0.0:${PORT + 1}`, grpc.ServerCredentials.createInsecure(), () => {
  logger.info(`gRPC ignited on port ${PORT + 1}`);
});

module.exports = { app, server };