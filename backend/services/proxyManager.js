/**
 * Proxy Manager - Multi-cloud orchestration, auto-scaling pools.
 */
const axios = require('axios');
const { logger } = require('../utils/logger');

let proxyPool = [];
const providers = ['brightdata', 'luminati', 'aws', 'gcp'];

async function getProxy() {
  if (proxyPool.length < 5) {
    await loadProxies();
  }
  const proxy = proxyPool.pop();
  logger.info(`Assigned proxy: ${proxy.provider} - ${proxy.country}`);
  return proxy;
}

async function releaseProxy(proxy) {
  if (await healthCheck(proxy)) {
    proxyPool.push(proxy);
  } else {
    logger.warn(`Proxy ${proxy.ip} failed health check—discarded.`);
  }
}

async function loadProxies() {
  try {
    const promises = providers.map(p => axios.get(`http://api.${p}.com/proxy?key=${process.env[`${p.toUpperCase()}_PROXY_KEY`]}&count=50`));
    const responses = await Promise.all(promises);
    proxyPool = responses.flatMap((r, i) => r.data.proxies.map(p => ({
      ip: p.ip,
      username: p.username,
      password: p.password,
      country: p.country,
      provider: providers[i],
      latency: p.latency || Math.random() * 100,
    })));
    proxyPool.sort((a, b) => a.latency - b.latency); // Prioritize low latency
  } catch (error) {
    logger.error(`Proxy load failed: ${error.message}`);
    proxyPool.push({ ip: 'localhost', username: '', password: '', country: 'US', provider: 'fallback' });
  }
}

async function healthCheck(proxy) {
  try {
    const { data } = await axios.get('https://api.ipify.org', { proxy: { host: proxy.ip, auth: { username: proxy.username, password: proxy.password } } });
    return data === proxy.ip;
  } catch {
    return false;
  }
}

module.exports = { proxyManager: { getProxy, releaseProxy, loadProxies } };