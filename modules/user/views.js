const JOIUserValidationUtilObj = require("../../utils/validators/joi_user_validator.js");

const userHelperObj = require("./helpers");
const userValidatorUtilObj = require("../../utils/validators/user_validator");
const HTTP_ERRORS = require("../../errors/generic-codes.js");
const organizationValidatorObj = require("../../utils/validators/organization_validator");
/**
 * CREATE USER
 * @param {Object} request
 * @param {Object} response
 */
exports.createUser = async (request, response) => {
  const [payload] = [request.body];

  // checking the validation of the provided payload
  const validation = JOIUserValidationUtilObj.userValidation(payload);
  if (validation.error) {
    // TODO: make this error body standard
    return response.status(HTTP_ERRORS.BAD_REQUEST.statusCode).send({
      ref: HTTP_ERRORS.BAD_REQUEST.message,
      error: validation.error.details,
    });
  } else {
    if (validation.value) {
      if (payload.organization_id) {
        const validOrganizationId =
          await organizationValidatorObj.checkValidOrganizationId(
            payload.organization_id
          );
        if (!validOrganizationId) {
          return response.status(HTTP_ERRORS.NOT_FOUND.statusCode).send({
            ref: HTTP_ERRORS.NOT_FOUND.ref,
            error: HTTP_ERRORS.NOT_FOUND.error,
            message: `Organization - ${HTTP_ERRORS.NOT_FOUND.message}`,
          });
        }
      }
      const userInfo = await userHelperObj.saveUser(payload);
      if (userInfo.errorFlag) {
        return response.status(400).send({
          ref: "USER_CREATION_ERROR",
          message: userInfo.errorMessage,
        });
      }
      return response.status(201).send({
        ref: "SUCCESS",
        data: {
          user: {
            id: userInfo.data.id,
          },
        },
      });
    } else {
      return response.status(400).send({
        type: "error",
        message: "Validation did not return a valid value.",
      });
    }
  }
};

/**
 * UPDATE USER
 * @param {Object} request
 * @param {Object} response
 */
exports.updateUser = async (request, response) => {
  const [userId, payload] = [request.params.userId, request.body];

  // checking the validation of the provided payload
  const validatorObj = new userValidatorUtilObj.PayloadValidation();

  if (payload.email && (await !validatorObj.isValidEmail(payload.email))) {
    return response.status(400).send({
      type: "email",
      message: "Invalid email supplied.",
    });
  }
  if (
    payload.email &&
    (await validatorObj.isDuplicateEmail(payload.email, userId))
  ) {
    return response.status(400).send({
      type: "email",
      message: "Supplied email already exists.",
    });
  }
  if (
    payload.username &&
    (await !validatorObj.isValidUsername(payload.username))
  ) {
    return response.status(400).send({
      type: "username",
      message: "Invalid username supplied.",
    });
  }
  if (
    payload.username &&
    (await validatorObj.isDuplicateUsername(payload.username))
  ) {
    return response.status(400).send({
      type: "username",
      message: "Supplied username already exists.",
    });
  } else {
    const updateResp = await userHelperObj.updateUser(userId, payload);
    if (updateResp.id) {
      return response.status(200).send({
        type: "success",
        id: updateResp.id,
      });
    } else {
      return response.status(400).send({
        type: updateResp.type,
        message: updateResp.message,
      });
    }
  }
};

exports.getUserList = (request, response) => {
  console.log("Fetching users...");
};
