const { User } = require("./models");

exports.saveUser = (payload) => {
    let userInfo = new User();
    userInfo.first_name = payload.first_name;
    userInfo.last_name = payload.last_name;
    userInfo.email = payload.email;
    userInfo.username = payload.username;
    userInfo.contact = payload.contact
    userInfo.theme_code = payload.theme_code
    userInfo.is_admin = payload.is_admin
    userInfo.avatar = payload.avatar
    
    if (payload.password && payload.password.length > 0) {
        userInfo.setPassword(payload.password);
    }
    else {
        userInfo.setPassword("Temporary@9999");
    }
    userInfo.save();
    return userInfo;
}