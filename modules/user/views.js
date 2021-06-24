const userHelperObj = require("./helpers")

exports.createUser = async (request, response) => {
    let [payload] = [request.body];
    let userInfo = await userHelperObj.saveUser(payload);
    response.status(201).send({
        message: "user created"
    })
}