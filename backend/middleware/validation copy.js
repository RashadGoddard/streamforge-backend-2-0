/**
 * Validation Middleware - Sanitizes inputs, prevents injection.
 */
const { validationResult } = require('express-validator');
const { logger } = require('../utils/logger');

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed: ${JSON.stringify(errors.array())}`);
    return res.status(400).json({ errors: errors.array() });
  }
  // Sanitize inputs (mock; use express-sanitizer for real)
  for (const key in req.body) {
    req.body[key] = String(req.body[key]).replace(/[<>]/g, '');
  }
  next();
};

module.exports = { validationMiddleware };