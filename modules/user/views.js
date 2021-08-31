const bunyan = require("../../utils/logger_utils/bunyan");
const winstonLogger = require("../../utils/logger_utils/winston");
const log = bunyan.logger;

const userHelperObj = require("./helpers")
const userValidatorUtilObj = require("../../utils/validators/user_validator")

exports.createUser = async (request, response) => {

    winstonLogger.error("Nothing")
    let [payload] = [request.body];

    // checking the validation of the provided payload
    let validatorObj = new userValidatorUtilObj.PayloadValidation(payload);
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