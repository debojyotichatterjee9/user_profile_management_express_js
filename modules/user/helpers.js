const { User } = require("./models");

exports.saveUser = (payload) => {
    let userInfo = new User();
    userInfo.first_name = payload.first_name;
    userInfo.last_name = payload.last_name;
    userInfo.email = payload.email;
    userInfo.username = payload.username;
    userInfo.address = payload.address;
    userInfo.contact = payload.contact;
    userInfo.social_profiles = payload.social_profiles;
    userInfo.theme_code = payload.theme_code;
    userInfo.is_admin = payload.is_admin;
    userInfo.is_enabled = payload.is_enabled;
    userInfo.is_activated = payload.is_activated;
    userInfo.is_deleted = payload.is_deleted;
    userInfo.avatar = payload.avatar;
    
    if (payload.password && payload.password.length > 0) {
        userInfo.setPassword(payload.password);
    }
    else {
        userInfo.setPassword("Temporary@9999");
    }
    userInfo.save();
    return userInfo;
}



exports.getUserInfoById = async (userId) => {
    try {
        let userInfo = await User.findById(userId).select([
            "-salt_key",
            "-secret_hash",
            "-__v",
            "-is_deleted"
        ]);
        if (!userInfo) {
            return false;
        }
        return userInfo;
    } catch (err) {
        return false;
    }
};