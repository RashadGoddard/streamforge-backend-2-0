/**
 * Stream Model - Logs boasts with blockchain hash, AI confidence.
 */
const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true, index: true },
  songTitle: String,
  platform: {
    type: String,
    enum: ['spotify', 'appleMusic', 'deezer', 'tiktok', 'youtubeMusic', 'instagram', 'snapchat', 'amazonMusic', 'soundcloud', 'audiomack', 'twitch', 'youtubeVideo'],
    required: true
  },
  playCount: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
  evasionPloy: String,
  ipUsed: String, // Kyber-encrypted
  success: { type: Boolean, default: true },
  confidence: Number, // AI prediction score (0-1)
  blockchainHash: String, // Hyperledger proof
}, { timestamps: true, autoIndex: true });

module.exports = mongoose.model('Stream', streamSchema);