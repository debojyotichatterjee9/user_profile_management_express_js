const { logger } = require("../../utils/logger_utils/bunyan")
const authValidatorUtilObj = require("../../utils/validators/auth_validator")
const authHelperObj = require("./helpers.js")

exports.login = async (request, response) => {
    const [payload] = [request.body];

    logger.info({ payload: payload }, 'Login View Function')

    // checking the validation of the provided payload
    const validatorObj = new authValidatorUtilObj.PayloadValidation(payload)
    validation = await validatorObj.isValidPayload();

    if (!validation.status) {
        response.status(400).send({
            type: "error",
            message: validation.messages
        })
    }
    else {
        const [userIdentity, password] = [payload.email ? payload.email : payload.username, payload.password]
        const validationResp = await authHelperObj.validateCredentials(userIdentity, password);
        if (validationResp) {
            let sessionData = await authHelperObj.startSession({
                'user_id': validationResp.id,
                'user_agent': request.headers['user-agent'],
                'ip': request.headers['x-real-ip'] || request.connection.remoteAddress
            });
            response.status(200).send({
                type: "success",
            });
        }
        else {
            response.status(400).send({
                type: "failed",
            });
        }
    }
}