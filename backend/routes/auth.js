/**
 * Auth Middleware - Quantum-safe JWT, session validation.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token—access denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.sessions.find(s => s.token === decoded.session)) {
      return res.status(401).json({ error: 'Invalid session—re-authenticate.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Auth failed: ${error.message}`);
    res.status(401).json({ error: 'Token invalid—renew your sins.' });
  }
};

module.exports = { authMiddleware };