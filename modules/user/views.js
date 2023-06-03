const bunyan = require("../../utils/logger_utils/bunyan");
const winstonLogger = require("../../utils/logger_utils/winston");
const log = bunyan.logger;
const JOIUserValidationUtilObj = require("../../utils/validators/joi_user_validator.js")

const userHelperObj = require("./helpers")
const userValidatorUtilObj = require("../../utils/validators/user_validator");
const { options } = require("joi");

/**
 * CREATE USER
 * @param {Object} request 
 * @param {Object} response 
 */
exports.createUser = async (request, response) => {

  let [payload] = [request.body];

  // checking the validation of the provided payload
  let validation = JOIUserValidationUtilObj.userValidation(payload);
  if (validation.error) {
    return 0;
  }
  else {
    if (validation.value) {
      let userInfo = await userHelperObj.saveUser(payload);
      if (userInfo.errorFlag) {
        return response.status(400).send({
          ref: "USER_CREATION_ERROR",
          message: userInfo.errorMessage
        });
      }
      return response.status(201).send({
        ref: "SUCCESS",
        data: {
          user: {
            id: userInfo.data.id
          }
        }
      });
    }
    else {
      return response.status(400).send({
        type: "error",
        message: "Validation does not return a valid value."
      })
    }
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


exports.getUserList = (request, response) => {
  console.log("Fetching users...")
}
