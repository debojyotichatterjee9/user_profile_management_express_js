const bunyan = require("../../utils/logger_utils/bunyan");
const winstonLogger = require("../../utils/logger_utils/winston");
const log = bunyan.logger;

const userHelperObj = require("./helpers")
const userValidatorUtilObj = require("../../utils/validators/user_validator")

/**
 * CREATE USER
 * @param {Object} request 
 * @param {Object} response 
 */
exports.createUser = async (request, response) => {

    let [payload] = [request.body];

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
        return response.status(201).send({
            type: "success",
            id: userInfo.id
        })
    }
}

/**
 * UPDATE USER
 * @param {Object} request 
 * @param {Object} response 
 */
exports.updateUser = async (request, response) => {

    let [userId, payload] = [request.params.userId, request.body];

    // checking the validation of the provided payload
    let validatorObj = new userValidatorUtilObj.PayloadValidation();

    if (payload.email && await !validatorObj.isValidEmail(payload.email)) {
        return response.status(400).send({
            type: "email",
            message: "Invalid email supplied."
        })
    }
    if (payload.email && await validatorObj.isDuplicateEmail(payload.email, userId)) {
        return response.status(400).send({
            type: "email",
            message: "Supplied email already exists."
        })
    }
    if (payload.username && await !validatorObj.isValidUsername(payload.username)) {
        return response.status(400).send({
            type: "username",
            message: "Invalid username supplied."
        })
    }
    if (payload.username && await validatorObj.isDuplicateUsername(payload.username)) {
        return response.status(400).send({
            type: "username",
            message: "Supplied username already exists."
        })
    }
    else {
        let updateResp = await userHelperObj.updateUser(userId, payload);
        if (updateResp.id) {
            return response.status(200).send({
                type: "success",
                id: updateResp.id
            });
        }
        else {
            return response.status(400).send({
                type: updateResp.type,
                message: updateResp.message
            })
        }

    }
}