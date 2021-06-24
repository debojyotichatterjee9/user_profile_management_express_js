const { User } = require("./models");

exports.saveUser = (payload) => {
    let userInfo = new User();
    userInfo.first_name = payload.first_name
    userInfo.last_name = payload.last_name
    userInfo.email = payload.email
    userInfo.username = payload.username
    userInfo.save()
}