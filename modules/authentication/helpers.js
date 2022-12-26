const { Session } = require("./models");
const { User } = require("../user/models");
const path = require("path");
const config = require("config");

exports.validateCredentials = async (userIdentity, password) => {

    const userInfo = await User.findOne({
        $or: [
            { username: userIdentity.toLowerCase() },
            { email: userIdentity.toLowerCase() }
        ]
    });
    if (userInfo) {
        const passwordValidation = await userInfo.validatePassword(password);
        return userInfo;
    }
    return false;

};

exports.startSession = async (params) => {
    let promise = new Promise((resolve, reject) => {
        const privateKeyFile = path.join(__dirname, '..', '..', config.get('sessions').security.private_key);
        let sessionEntry = new Session();
        sessionEntry.user_id = params.user_id;
        sessionEntry.user_agent = params.user_agent;
        sessionEntry.ip = params.ip;
        sessionEntry.generateToken(params.user_id, params.email, privateKeyFile);

        sessionEntry.save((err, sessionData) => {
            if (err) {
                console.log(err);
                resolve(false);
            }

            resolve({
                'sid': sessionEntry._id,
                'token': sessionEntry.token
            });
        });
    });

    return promise;
};


exports.validateSession = async (token, params) => {
    const publicKeyFile = config.get('sessions').security.public_key;
    let sessionInfo = await

        Session.findOneAndUpdate({
            'token': token
        }, {
            last_access_on: Date.now()
        }, {
            'upsert': false
        });
    if (sessionInfo) {
        let timestamp = Math.round(Date.now() / 1000);
        let tokenData = await sessionInfo.decodeToken(sessionInfo.token, publicKeyFile);
        if (false !== tokenData &&
            sessionInfo.user_agent === params.user_agent &&
            tokenData.azp === String(sessionInfo.user_id) &&
            tokenData.exp > timestamp) {
            return sessionInfo;
        }
    }
    return false;
};