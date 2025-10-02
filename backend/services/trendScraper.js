/**
 * Trend Scraper - AI-driven DSP trend analysis from X, Chartmetric.
 */
const axios = require('axios');
const cheerio = require('cheerio');
const { logger } = require('../utils/logger');

async function scrapeTrends() {
  try {
    const sources = [
      { url: 'https://api.twitter.com/2/tweets/search/recent?query=streaming%20fraud%20OR%20bot%20detection', headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` } },
      { url: 'https://www.chartmetric.com/news/streaming-fraud', headers: {} },
      { url: 'https://www.musicbusinessworldwide.com/tag/streaming-fraud/', headers: {} },
    ];

    const trends = [];
    for (const source of sources) {
      const { data } = await axios.get(source.url, { headers: source.headers });
      const $ = source.url.includes('twitter') ? { text: () => JSON.stringify(data) } : cheerio.load(data);
      const signals = $('p,div').text().match(/bot|fraud|detection|crackdown|algorithm/gi) || [];
      trends.push({
        platform: extractPlatform(source.url),
        signals,
        boostFactor: signals.includes('crackdown') ? 0.8 : 1.2,
        timestamp: new Date(),
      });
    }

    logger.info(`Scraped ${trends.length} trends—AI strategies updated.`);
    return trends;
  } catch (error) {
    logger.error(`Trend scrape failed: ${error.message}`);
    return [];
  }
}

function extractPlatform(url) {
  return url.includes('spotify') ? 'spotify' : url.includes('tiktok') ? 'tiktok' : 'general';
}

module.exports = { scrapeTrends };