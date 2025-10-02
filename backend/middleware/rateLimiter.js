/**
 * Rate Limiter - Sliding window, Redis-backed for scale.
 */
const { logger } = require('../utils/logger');

const rateLimiter = (req, res, next) => {
  // Mock Redis; use redis-rate-limiter for real
  const key = `${req.user?.userId || req.ip}:rate`;
  const limit = 100; // 100 reqs/5min
  const window = 5 * 60 * 1000;

  // Simulate Redis check
  let requests = parseInt(localStorage.getItem(key) || '0', 10);
  if (requests >= limit) {
    logger.warn(`Rate limit exceeded for ${key}`);
    return res.status(429).json({ error: 'Too many requests—slow your divine wrath.' });
  }

  localStorage.setItem(key, (requests + 1).toString());
  setTimeout(() => {
    localStorage.setItem(key, Math.max(0, parseInt(localStorage.getItem(key)) - 1).toString());
  }, window);

  next();
};

module.exports = { rateLimiter };