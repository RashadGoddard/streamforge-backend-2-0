/**
 * Blockchain Config - Hyperledger Fabric for immutable stream logs.
 */
const fabric = require('hyperledger-fabric-sdk');
const { logger } = require('../utils/logger');

async function initBlockchain() {
  try {
    const network = await fabric.connect({
      peer: process.env.HYPERLEDGER_PEER,
      channel: 'streamforge',
      chaincode: 'audit',
    });
    logger.info('Hyperledger Fabric network online—audit trail eternal.');
    return network;
  } catch (error) {
    logger.error(`Blockchain init failed: ${error.message}`);
    throw error;
  }
}

/**
 * Log stream to blockchain.
 * @param {Object} streamData - Stream doc
 */
async function logStream(streamData) {
  const network = await initBlockchain();
  const contract = network.getContract('audit');
  await contract.submitTransaction('logStream', JSON.stringify({
    ...streamData,
    timestamp: new Date().toISOString(),
    proof: generateZeroKnowledgeProof(streamData),
  }));
  logger.info(`Stream logged to blockchain: ${streamData.id}`);
}

/**
 * Zero-knowledge proof for deniability.
 */
function generateZeroKnowledgeProof(data) {
  // Mock ZK-SNARK (use snarkjs for real impl)
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

module.exports = { initBlockchain, logStream };