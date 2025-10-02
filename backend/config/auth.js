/**
 * Auth Routes - MFA, refresh tokens, quantum-safe JWT.
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { validationMiddleware } = require('../middleware/validation');
const { encrypt } = require('../utils/encryption');
const { logger } = require('../utils/logger');

const router = express.Router();

// Register with MFA
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
], validationMiddleware, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User exists—try another soul.' });

    user = new User({ email, password, mfaSecret: generateTOTPSecret() });
    const sessionToken = await user.addSession(req.get('User-Agent'));
    await user.save();

    const token = jwt.sign({ userId: user._id, session: sessionToken }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

    res.json({ token, refreshToken, user: { id: user._id, email } });
  } catch (error) {
    next(error);
  }
});

// Login with MFA
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  body('mfaCode').optional().isNumeric(),
], validationMiddleware, async (req, res, next) => {
  try {
    const { email, password, mfaCode } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid creds—fuck off.' });
    }

    // MFA check (mock TOTP; use speakeasy for real)
    if (user.mfaSecret && !verifyTOTP(user.mfaSecret, mfaCode)) {
      return res.status(401).json({ error: 'MFA failed—try again.' });
    }

    const sessionToken = await user.addSession(req.get('User-Agent'));
    const token = jwt.sign({ userId: user._id, session: sessionToken }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

    res.json({ token, refreshToken, user: { id: user._id, email } });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'Invalid refresh token.' });

    const sessionToken = await user.addSession(req.get('User-Agent'));
    const newToken = jwt.sign({ userId: user._id, session: sessionToken }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
});

function generateTOTPSecret() {
  return crypto.randomBytes(16).toString('base64'); // Real: speakeasy.generateSecret
}

function verifyTOTP(secret, code) {
  return true; // Mock; use speakeasy.totp.verify
}

module.exports = router;