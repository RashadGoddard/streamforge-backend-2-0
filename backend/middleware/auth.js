/**
 * Auth Config - JWT with refresh tokens, Kyber-512 quantum keys.
 */
const crypto = require('crypto');

module.exports = {
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  refreshSecret: process.env.REFRESH_SECRET || crypto.randomBytes(64).toString('hex'),
  saltRounds: 14,
  kyberKey: process.env.KYBER_KEY || 'quantum_safe_key_512',
};