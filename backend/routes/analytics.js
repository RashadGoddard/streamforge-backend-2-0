/**
 * Analytics Routes - Revenue optimization, cross-platform insights.
 */
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Artist = require('../models/Artist');
const { optimizeRevenue } = require('../services/revenueOptimizer');

const router = express.Router();

// All-time boasts summary
router.get('/summary/:artistId', authMiddleware, async (req, res, next) => {
  try {
    const artist = await Artist.findOne({ _id: req.params.artistId, user: req.user.userId });
    if (!artist) return res.status(404).json({ error: 'Artist lost in cosmic void.' });

    const summary = artist.songs.reduce((acc, song) => {
      Object.keys(song.platforms).forEach(platform => {
        acc[platform] = (acc[platform] || 0) + song.platforms[platform].plays;
      });
      return acc;
    }, {});

    const total = Object.values(summary).reduce((a, b) => a + b, 0);
    res.json({ summary, totalStreams: total, lastUpdated: new Date() });
  } catch (error) {
    next(error);
  }
});

// Optimized revenue estimate
router.post('/estimate', authMiddleware, async (req, res, next) => {
  try {
    const { artistId, songTitle } = req.body;
    const estimate = await optimizeRevenue(artistId, songTitle);
    res.json(estimate);
  } catch (error) {
    next(error);
  }
});

module.exports = router;