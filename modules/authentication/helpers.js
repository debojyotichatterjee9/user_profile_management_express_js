const { Session } = require("./models");
const { User } = require("../user/models")

exports.validateCredentials = (userIdentity, password) => {

const userInfo = User.findOne({
    $or:[
        { username: userIdentity.toLoweCase() },
        { email: userIdentity.toLoweCase() }
    ]
});
if(userInfo) {
    const passwordValidation = userInfo.validatePassword(password);
    return passwordValidation;
}
return false;

}