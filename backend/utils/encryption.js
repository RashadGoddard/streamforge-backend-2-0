/**
 * Encryption Utils - Kyber-512 for quantum-safe comms.
 */
const kyber = require('kyber-js');
const CryptoJS = require('crypto-js');
const { logger } = require('./logger');

const encrypt = (text, secret = process.env.KYBER_KEY) => {
  try {
    const { ciphertext } = kyber.encrypt(text, secret); // Post-quantum
    return ciphertext.toString('hex');
  } catch (error) {
    logger.warn(`Kyber encryption failed: ${error.message}. Falling back to AES.`);
    return CryptoJS.AES.encrypt(text, secret).toString();
  }
};

const decrypt = (ciphertext, secret = process.env.KYBER_KEY) => {
  try {
    const { plaintext } = kyber.decrypt(Buffer.from(ciphertext, 'hex'), secret);
    return plaintext.toString();
  } catch (error) {
    logger.warn(`Kyber decryption failed: ${error.message}. Falling back to AES.`);
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

module.exports = { encrypt, decrypt };