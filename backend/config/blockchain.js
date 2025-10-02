/**
 * Blockchain Service - Logs streams with zero-knowledge proofs.
 */
const { Gateway, Wallets } = require('fabric-network');
const { logger } = require('../utils/logger');
const { encrypt } = require('../utils/encryption');

/**
 * Log stream to Hyperledger with ZK proof.
 * @param {Object} streamData
 */
async function logToBlockchain(streamData) {
  try {
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    const gateway = new Gateway();
    
    await gateway.connect(process.env.HYPERLEDGER_PEER, {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('streamforge');
    const contract = network.getContract('audit');
    
    const proof = generateZKProof(streamData);
    await contract.submitTransaction('logStream', JSON.stringify({
      ...streamData,
      ipUsed: encrypt(streamData.ipUsed),
      proof,
    }));
    
    logger.info(`Stream ${streamData.id} etched in blockchain eternity.`);
    await gateway.disconnect();
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
  // Mock; use snarkjs for real implementation
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

module.exports = { logToBlockchain };