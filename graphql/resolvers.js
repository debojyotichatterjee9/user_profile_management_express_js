const { logger } = require("../utils/logger_utils/bunyan");
const authValidatorUtilObj = require("../utils/validators/auth_validator");
const authHelperObj = require("../modules/authentication/helpers");
const userHelperObj = require("../modules/user/helpers");
const userValidatorUtilObj = require("../utils/validators/user_validator");
const sendgridHelper = require("../utils/mailer/sendgrid");



module.exports = {

  createUser: async ({ payload }, request) => {
    // let [payload] = [request.body];

    // checking the validation of the provided payload
    let validatorObj = new userValidatorUtilObj.PayloadValidation(payload);
    validation = await validatorObj.isValidPayload();

    if (!validation.status) {
      const error = new Error();
      error.status = 400;
      error.ref = "Validation Error"
      error.message = validation.messages
      throw error;
    }
    else {
      let userInfo = await userHelperObj.saveUser(payload);
      return userInfo
    }
  },

  login: async ({ payload }, request) => {

    logger.info({ payload: payload }, 'Login View Function')

    // checking the validation of the provided payload
    const validatorObj = new authValidatorUtilObj.PayloadValidation(payload)
    validation = await validatorObj.isValidPayload();

    if (!validation.status) {
      const error = new Error()
      error.status = 400;
      error.ref = "Validation Error"
      error.message = validation.messages
      throw error;

    }
    else {
      const [userIdentity, password] = [payload.email ? payload.email : payload.username, payload.password]
      const validationResp = await authHelperObj.validateCredentials(userIdentity, password);
      if (validationResp) {
        let sessionData = await authHelperObj.startSession({
          "user_id": validationResp.id,
          "email": validationResp.email,
          "user_agent": request.headers['user-agent'],
          "ip": request.headers['x-real-ip'] || request.connection.remoteAddress
        });
        sendgridHelper.transporter.sendMail({
          to: validationResp.email,
          from: "debojyotic@duck.com",
          subject: "Login Successful",
          html: `<h1>Your account has been logged in from ${request.headers['x-real-ip'] || request.connection.remoteAddress} </h1>`
        });
        console.log(sessionData)
        return sessionData;
      }
      else {
        const error = new Error()
        error.status = 400;
        error.ref = "Validation Error"
        error.message = validation.messages
        throw error;
      }
    }
  }

}
