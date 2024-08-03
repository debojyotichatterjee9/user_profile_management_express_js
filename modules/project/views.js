const HTTP_RESPONSE = require("../../constants/http-generic-codes.js");
const createProjectValidatorUtilObj = require("../../utils/validators/joi_create_project_validator.js");
const projectHelperObj = require("./helpers");

exports.createProject = async (request, response) => {
  try {
    const [payload] = [request.body];

    const validation =
    createProjectValidatorUtilObj.createProjectValidation(payload);
    if (validation.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        error: validation.error.details,
      });
    } else {
      if (validation.value) {
        const createProjectResp = await projectHelperObj.createProject(
          payload
        );
        if (createProjectResp.errorFlag) {
          return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
            ref: HTTP_RESPONSE.BAD_REQUEST.ref,
            error: HTTP_RESPONSE.BAD_REQUEST.error,
            message: createProjectResp.mesage,
          });
        }
        return response.status(201).send({
          ref: "SUCCESS",
          data: {
            project: {
              id: createProjectResp.projectInfo.project_id,
            },
          },
        });
      } else {
        return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
          ref: HTTP_RESPONSE.BAD_REQUEST.ref,
          error: HTTP_RESPONSE.BAD_REQUEST.error,
          message: "Validation did not return a valid value.",
        });
      }
    }
  } catch (error) {
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: error.message,
      });
  }
};