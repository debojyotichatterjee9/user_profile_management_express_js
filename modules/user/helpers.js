const { User } = require("./models");

/**
 * SAVE USER
 * @param {Object} payload 
 * @returns 
 */
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

/**
 * UPDATE USER
 * @param {Object} payload 
 * @returns 
 */
exports.updateUser = async (userId, payload) => {

    let userInfo = await User.findById(userId);
    if (userInfo) {
        userInfo.first_name = payload.first_name;
        userInfo.last_name = payload.last_name;
        userInfo.email = payload.email;
        userInfo.username = payload.username;
        userInfo.address = payload.address;
        userInfo.contact = payload.contact;
        userInfo.social_profiles = payload.social_profiles;
        userInfo.theme_code = payload.theme_code;
        userInfo.is_admin = payload.is_admin;
        userInfo.avatar = payload.avatar;   
    }
    else {
        return {
            type: "failed",
            message: "User not found."
        }
    }
    userInfo.save();
    return userInfo;
}