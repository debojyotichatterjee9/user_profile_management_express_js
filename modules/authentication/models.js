const config = require('config');
const mongoose = require('mongoose');
const uuid = require("uuid");
const fs = require('fs');

const SessionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.String, default: uuid.v4() },
    token: String,
    user_id: { type: mongoose.Schema.Types.String, ref: 'User' },
    user_email: { type: mongoose.Schema.Types.String, ref: 'User' },
    user_agent: String,
    ip: String,
}, { collection: 'user_sessions' });

SessionSchema.index({
    "created_on": 1
}, { expireAfterSeconds: config.get('session').expiry });

SessionSchema.plugin(mongooseTimestamp);
exports.Session = mongoose.model('Session', SessionSchema);