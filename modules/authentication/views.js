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



exports.validateSession = async (request, response) => {
    const authHeader = httpReq.headers.authorization;
    if (!authHeader) {
        return httpResp.status(401).send({
            error: {
                code: 'MISSING_TOKEN',
                message: 'Unauthorized Access.'
            }
        });
    }
    let token = authHeader.split(' ')[1];
    let sessionInfo = await authHelperObj.validateSession(token, {
        user_agent: httpReq.headers['user-agent']
    });

    if (false !== sessionInfo) {
        let userInfo = await userHelperObj.getUserInfoById(sessionInfo.user_id);

        httpResp.status(200).send({
            user: userInfo
        });
    }
    else {
        httpResp.status(401).send({
            error: {
                code: 'INVALID_TOKEN',
                message: 'Unauthorized Access.'
            }
        });
    }
}