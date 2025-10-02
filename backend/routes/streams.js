/**
 * Streams Routes - Boost orchestration with AI confidence, blockchain logging.
 */
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');
const Stream = require('../models/Stream');
const Artist = require('../models/Artist');
const { botEngine } = require('../services/botEngine');
const { logStream } = require('../config/blockchain');

const router = express.Router();

// Initiate boost with AI orchestration
router.post('/boost', authMiddleware, rateLimiter, async (req, res, next) => {
  try {
    const { artistId, songTitle, platforms } = req.body;
    const artist = await Artist.findOne({ _id: artistId, user: req.user.userId });
    if (!artist) return res.status(404).json({ error: 'Artist not found in divine records.' });

    // AI-driven boost with transformer confidence
    const results = await botEngine.boostStreams(artist, songTitle, platforms);

    // Log to DB and blockchain
    for (const result of results) {
      const stream = await new Stream(result).save();
      await logStream({ ...result, id: stream._id }); // Immutable audit
      await Artist.findByIdAndUpdate(artistId, {
        $inc: { [`songs.0.platforms.${result.platform}.plays`]: 1 },
        $set: { [`songs.0.platforms.${result.platform}.successRate`]: result.confidence },
      });
    }

    res.json({ success: true, results, message: 'Streams ignited—revenue ascends.' });
  } catch (error) {
    next(error);
  }
});

// Boost history with filters
router.get('/:artistId/history', authMiddleware, async (req, res, next) => {
  try {
    const { platform, startDate, endDate } = req.query;
    const query = { artistId: req.params.artistId };
    if (platform) query.platform = platform;
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const streams = await Stream.find(query)
      .sort({ timestamp: -1 })
      .limit(500)
      .lean();
    res.json(streams);
  } catch (error) {
    next(error);
  }
});

module.exports = router;