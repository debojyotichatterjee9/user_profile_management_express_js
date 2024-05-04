const config = require('config');
const mongoose = require('mongoose');
const uuid = require('uuid');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const SessionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.String, default: uuid.v4() },
  token: String,
  user_id: { type: mongoose.Schema.Types.String, ref: 'User' },
  user_email: { type: mongoose.Schema.Types.String, ref: 'User' },
  user_agent: String,
  ip: String,
  last_access_on: { type: Date, default: Date.now }
}, {
  collection: 'user_sessions',
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

SessionSchema.index({
  created_on: 1
}, { expireAfterSeconds: config.get('sessions').expiry_in_seconds });

SessionSchema.methods.generateToken = function (userId, email, keyFile) {
  const privateKey = fs.readFileSync(keyFile);

  const token = jwt.sign({
    iss: 'user_profile_mgmt',
    aud: 'user',
    sub: 'authentication',
    email,
    azp: userId
  }, privateKey, {
    algorithm: 'RS256',
    expiresIn: config.get('sessions').expiry_in_seconds
  });
  this.token = token;
};

SessionSchema.methods.decodeToken = function (token, keyFile) {
  try {
    const publicKey = fs.readFileSync(keyFile);
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256']
    });
    return decoded;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// SessionSchema.plugin(mongooseTimestamp);
exports.Session = mongoose.model('Session', SessionSchema);
