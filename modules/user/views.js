const userHelperObj = require("./helpers")

exports.createUser = async (request, response) => {
    let [payload] = [request.body];

    let validatorObj = new userHelperObj.PayloadValidation(payload);
    validation = await validatorObj.isValidPayload();
    if (!validation.status) {
        response.status(400).send({
            type: "error",
            message: validation.messages
        })
    }
    else {
        let userInfo = await userHelperObj.saveUser(payload);
        response.status(201).send({
            type: "success",
            id: userInfo.id
        })
    }
}