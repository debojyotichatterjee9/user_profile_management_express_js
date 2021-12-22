const config = require('config');
const mongoose = require('mongoose');
const uuid = require("uuid");
const fs = require('fs');
const jwt = require("jsonwebtoken");

const SessionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.String, default: uuid.v4() },
    token: String,
    user_id: { type: mongoose.Schema.Types.String, ref: 'User' },
    user_email: { type: mongoose.Schema.Types.String, ref: 'User' },
    user_agent: String,
    ip: String,
    last_access_on: { type: Date, default: Date.now }
}, { 
    collection: "user_sessions",
timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
    createdAt: "created_at",
    updatedAt: "updated_at"
} });

SessionSchema.index({
    "created_on": 1
}, { expireAfterSeconds: config.get('sessions').expiry_in_seconds });

SessionSchema.methods.generateToken = function(userId, keyFile) {
    let privateKey = fs.readFileSync(keyFile);

    let token = jwt.sign({
        iss: 'user_profile_mgmt',
        aud: 'user',
        sub: "authentication",
    }, privateKey, {
        algorithm: 'RS256',
        expiresIn: config.get('sessions').expiry_in_seconds
    });
    this.token = token;
};

// SessionSchema.plugin(mongooseTimestamp);
exports.Session = mongoose.model('Session', SessionSchema);