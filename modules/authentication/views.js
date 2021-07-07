const {logger} = require("../../utils/bunyan")
const authHelperObj = require("./helpers.js")

exports.login = async (request, response) => {
    const [payload] = [request.body];
    
    logger.info({ payload: payload }, 'Login View Function')
    
    // checking the validation of the provided payload
    const validatorObj = new authHelperObj.PayloadValidation(payload)
    validation = await validatorObj.isValidPayload();
    
    if (!validation.status) {
        response.status(400).send({
            type: "error",
            message: validation.messages
        })
    }
    else {
        response.status(200).send({
            type: "success",
        })
    }
}