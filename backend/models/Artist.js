/**
 * Artist Model - Tracks multi-platform streams with metadata.
 */
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  ids: {
    spotify: String,
    appleMusic: String,
    deezer: String,
    tiktok: String,
    youtube: String,
    instagram: String,
    snapchat: String,
    amazonMusic: String,
    soundcloud: String,
    audiomack: String,
    twitch: String,
  },
  songs: [{
    title: String,
    duration: Number,
    platforms: {
      spotify: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      appleMusic: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      deezer: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      tiktok: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      youtubeMusic: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      instagram: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      snapchat: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      amazonMusic: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      soundcloud: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      audiomack: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      twitch: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
      youtubeVideo: { plays: { type: Number, default: 0 }, lastBoost: Date, successRate: Number },
    },
    metadata: { genre: String, releaseDate: Date },
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, autoIndex: true });

module.exports = mongoose.model('Artist', artistSchema);