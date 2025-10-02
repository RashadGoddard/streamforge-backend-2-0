/**
 * Blockchain Service - Logs streams with zero-knowledge proofs.
 */
const fabric = require('hyperledger-fabric-sdk');
const { logger } = require('../utils/logger');
const { encrypt } = require('../utils/encryption');

/**
 * Log stream to Hyperledger with ZK proof.
 * @param {Object} streamData
 */
async function logToBlockchain(streamData) {
  try {
    const network = await fabric.connect({
      peer: process.env.HYPERLEDGER_PEER,
      channel: 'streamforge',
      chaincode: 'audit',
    });
    const contract = network.getContract('audit');
    const proof = generateZKProof(streamData);
    await contract.submitTransaction('logStream', JSON.stringify({
      ...streamData,
      ipUsed: encrypt(streamData.ipUsed),
      proof,
    }));
    logger.info(`Stream ${streamData.id} etched in blockchain eternity.`);
    return proof;
  } catch (error) {
    logger.error(`Blockchain log failed: ${error.message}`);
    throw error;
  }
}

/**
 * Generate ZK-SNARK proof for deniability.
 */
function generateZKProof(data) {
  // Mock; use snarkjs for real
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

module.exports = { logToBlockchain };