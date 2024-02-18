const { logger } = require('../../utils/logger_utils/bunyan');
const authValidatorUtilObj = require('../../utils/validators/auth_validator');
const authHelperObj = require('./helpers.js');
const userHelperObj = require('../user/helpers');
const sendgridHelper = require('../../utils/mailer/sendgrid');

exports.login = async (request, response) => {
  const [payload] = [request.body];

  logger.info({ payload }, 'Login View Function');

  // checking the validation of the provided payload
  const validatorObj = new authValidatorUtilObj.PayloadValidation(payload);
  validation = await validatorObj.isValidPayload();

  if (!validation.status) {
    response.status(400).send({
      type: 'error',
      message: validation.messages
    });
  } else {
    const [userIdentity, password] = [payload.email ? payload.email : payload.username, payload.password];
    const validationResp = await authHelperObj.validateCredentials(userIdentity, password);
    if (validationResp) {
      const sessionData = await authHelperObj.startSession({
        user_id: validationResp.id,
        email: validationResp.email,
        user_agent: request.headers['user-agent'],
        ip: request.headers['x-real-ip'] || request.connection.remoteAddress
      });
      sendgridHelper.transporter.sendMail({
        to: validationResp.email,
        from: 'debojyotic@duck.com',
        subject: 'Login Successful',
        html: `<h1>Your account has been logged in from ${request.headers['x-real-ip'] || request.connection.remoteAddress} </h1>`
      });
      response.status(200).send({
        type: 'success'
      });
    } else {
      response.status(400).send({
        type: 'failed'
      });
    }
  }
};

exports.validateSession = async (request, response) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).send({
      error: {
        code: 'MISSING_TOKEN',
        message: 'Unauthorized Access.'
      }
    });
  }
  const token = authHeader.split(' ')[1];
  const sessionInfo = await authHelperObj.validateSession(token, {
    user_agent: request.headers['user-agent']
  });
  if (sessionInfo !== false) {
    const userInfo = await userHelperObj.getUserInfoById(sessionInfo.user_id);
    response.status(200).send({
      user: userInfo
    });
  } else {
    response.status(401).send({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Unauthorized Access.'
      }
    });
  }
};
