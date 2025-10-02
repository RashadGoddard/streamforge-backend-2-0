/**
 * Trends Routes - Real-time DSP insights via AI scraper.
 */
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { scrapeTrends } = require('../services/trendScraper');

const router = express.Router();

// Get latest trends for AI strategies
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const trends = await scrapeTrends();
    res.json(trends);
  } catch (error) {
    next(error);
  }
});

module.exports = router;