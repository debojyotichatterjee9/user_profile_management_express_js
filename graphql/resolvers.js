const userHelperObj = require("../modules/user/helpers");
const userValidatorUtilObj = require("../utils/validators/user_validator");



module.exports = {
    createUser: async ({ payload }, request) => {
        // let [payload] = [request.body];

        // checking the validation of the provided payload
        let validatorObj = new userValidatorUtilObj.PayloadValidation(payload);
        validation = await validatorObj.isValidPayload();

        if (!validation.status) {
            return response.status(400).send({
                type: "error",
                message: validation.messages
            })
        }
        else {
            let userInfo = await userHelperObj.saveUser(payload);
            return userInfo
        }
    }
}