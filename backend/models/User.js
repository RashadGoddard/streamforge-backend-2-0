/**
 * User Model - Enhanced with multi-factor auth, session tracking.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { encrypt } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  mfaSecret: { type: String }, // For TOTP
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
  sessions: [{ token: String, expires: Date, device: String }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true, autoIndex: true });

// Hash password and encrypt sensitive data
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 14);
  }
  if (this.mfaSecret) {
    this.mfaSecret = encrypt(this.mfaSecret);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate session token
userSchema.methods.addSession = async function(device) {
  const token = crypto.randomBytes(32).toString('hex');
  this.sessions.push({ token, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), device });
  await this.save();
  return token;
};

module.exports = mongoose.model('User', userSchema);