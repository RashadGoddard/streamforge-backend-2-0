/**
 * Error Handler - Advanced logging, circuit breaker.
 */
const { logger } = require('../utils/logger');

let circuitBreaker = { state: 'CLOSED', failures: 0, threshold: 5, cooldown: 60000 };

const errorHandler = (err, req, res, next) => {
  circuitBreaker.failures++;
  if (circuitBreaker.failures > circuitBreaker.threshold) {
    circuitBreaker.state = 'OPEN';
    setTimeout(() => {
      circuitBreaker.state = 'HALF_OPEN';
      circuitBreaker.failures = 0;
    }, circuitBreaker.cooldown);
  }

  if (circuitBreaker.state === 'OPEN') {
    logger.error('Circuit breaker tripped—service paused.');
    return res.status(503).json({ error: 'Service overloaded—retry later.' });
  }

  logger.error(`${err.message} - ${req.method} ${req.path}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Cosmic failure—pray harder.' : err.message,
  });
};

module.exports = { errorHandler };