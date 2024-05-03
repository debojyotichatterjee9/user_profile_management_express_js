const createUserValidationObj = require("../../utils/validators/joi_create_user_validator.js");
const updateUserValidationObj = require("../../utils/validators/joi_update_user_validator.js")

const userHelperObj = require("./helpers");
const userValidatorUtilObj = require("../../utils/validators/user_validator");
const HTTP_RESPONSE = require("../../constants/http-generic-codes.js");
const organizationValidatorObj = require("../../utils/validators/organization_validator");
/**
 * CREATE USER
 * @param {Object} request
 * @param {Object} response
 */
exports.createUser = async (request, response) => {
  try {
    const [payload] = [request.body];

    // checking the validation of the provided payload
    const validationResp = createUserValidationObj.payloadValidation(payload);
    console.log(payload)
    if (validationResp.error) {
      // TODO: make this error body standard
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.message,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: validationResp.error.details
      });
    } else {
      if (validationResp.value) {
        if (payload.organization_id) {
          const validOrganizationId =
            await organizationValidatorObj.checkValidOrganizationId(
              payload.organization_id
            );
          if (!validOrganizationId) {
            return response.status(HTTP_RESPONSE.NOT_FOUND.statusCode).send({
              ref: HTTP_RESPONSE.NOT_FOUND.ref,
              error: HTTP_RESPONSE.NOT_FOUND.error,
              message: HTTP_RESPONSE.NOT_FOUND.message,
              info: `Organization - ${HTTP_RESPONSE.NOT_FOUND.message}`
            });
          }
        }
        const createUserResp = await userHelperObj.saveUser(payload);
        if (createUserResp.errorFlag) {
          return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
            ref: "USER_CREATION_ERROR",
            error: HTTP_RESPONSE.BAD_REQUEST.error,
            message: HTTP_RESPONSE.BAD_REQUEST.message,
            info: createUserResp.message,
          });
        }
        return response.status(201).send({
          ref: "SUCCESS",
          data: {
            user: {
              id: createUserResp.userInfo.authentication.id,
            },
          },
        });
      } else {
        return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
          ref: HTTP_RESPONSE.BAD_REQUEST.ref,
          error: HTTP_RESPONSE.BAD_REQUEST.error,
          message: HTTP_RESPONSE.BAD_REQUEST.message,
          info: "Validation did not return a valid value.",
        });
      }
    }
  } catch (error) {
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
        info: error.message
      });
  }
};

/**
 * UPDATE USER
 * @param {Object} request
 * @param {Object} response
 */
exports.updateUser = async (request, response) => {
  try {

    const [userId, payload] = [request.params.userId, request.body];

    // checking the validation of the provided payload
    // const validatorObj = new userValidatorUtilObj.PayloadValidation();
    const validationResp = updateUserValidationObj.payloadValidation(payload);

    if (validationResp.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.message,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: validationResp.error.details
      });
    }
    else {
      const updateUserResp = await userHelperObj.updateUser(userId, payload);
      if (updateUserResp.errorFlag) {
        return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
          ref: HTTP_RESPONSE.BAD_REQUEST.ref,
          error: HTTP_RESPONSE.BAD_REQUEST.error,
          message: HTTP_RESPONSE.BAD_REQUEST.message,
          info: updateUserResp.message
        });
      } return response.status(200).send({
        type: "SUCCESS",
        data: {
          user: updateUserResp.userInfo
        }
      });
    }
  } catch (error) {
    console.log(error)
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
        info: error.message
      });
  }
};
exports.getUserList = (request, response) => {
  console.log("Fetching users...");
};
