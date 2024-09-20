const HTTP_RESPONSE = require("../../constants/http-generic-codes.js");
const createMilestoneValidatorUtilObj = require("../../utils/validators/joi_create_milestone_validator.js");
const milestoneHelperObj = require("./helpers");
const commonValidatorObj = require("../../utils/validators/common-validators.js");
const updateMilestoneValidatorUtilObj = require("../../utils/validators/joi_update_milestone_validator.js")

exports.createMilestone = async (request, response) => {
  try {
    const [payload] = [request.body];

    const validation =
    createMilestoneValidatorUtilObj.createMilestoneValidation(payload);
    if (validation.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        error: validation.error.message,
      });
    } else {
      if (validation.value) {
        const createMilestoneResp = await milestoneHelperObj.createMilestone(
          payload
        );
        if (createMilestoneResp.errorFlag) {
          return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
            ref: HTTP_RESPONSE.BAD_REQUEST.ref,
            error: HTTP_RESPONSE.BAD_REQUEST.error,
            message: createMilestoneResp.message,
          });
        }
        return response.status(201).send({
          ref: "SUCCESS",
          data: {
            milestone: {
              id: createMilestoneResp.projectInfo.project_id,
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

exports.getMilestoneList = async (request, response) => {
  try {
    const queryParams = request.query;
    const milestoneListResp =
      await milestoneHelperObj.getMilestoneList(queryParams);
    if (milestoneListResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info:
        milestoneListResp?.message ?? "Unable to fetch organization list.",
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        total_projectss: milestoneListResp.total_projects,
        total_filtered_projects: milestoneListResp.total_filtered_projects,
        page: milestoneListResp.page,
        limit: milestoneListResp.limit,
        milestone_list: milestoneListResp.project_list,
      },
    });
  } catch (error) {
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
        info: error.message,
      });
  }
};

exports.getMilestoneDetails = async (request, response) => {
  try {
    const milestoneId = request.params.milestoneId;
    const milestoneDetailsResp =
      await milestoneHelperObj.getProjectInfoById(
        milestoneId
      );
    if (milestoneDetailsResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info:
        milestoneDetailsResp?.message ??
          "Unable to fetch milestone list.",
      });
    }
    if (!milestoneDetailsResp) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.NOT_FOUND.ref,
        error: HTTP_RESPONSE.NOT_FOUND.error,
        message: HTTP_RESPONSE.NOT_FOUND.message,
        info: milestoneDetailsResp.message,
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        milestone: milestoneDetailsResp,
      },
    });
  } catch (error) {
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
        info: error.message,
      });
  }
};

exports.updateMilestone = async(request, response) => {
  try {
    const [milestoneId, payload] = [request.params.milestoneId, request.body];

    const isMilestoneIdValid = commonValidatorObj.objectIdValidator(milestoneId);

    if (!isMilestoneIdValid) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: "Invalid ID provided.",
      });
    }

    const validationResp = updateMilestoneValidatorUtilObj.updateMilestoneValidation(payload);

    if (validationResp.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: validationResp.error.details,
      });
    } else {
      const updateMilestoneResp = await milestoneHelperObj.updateProject(milestoneId, payload);
      if (updateMilestoneResp.errorFlag) {
        return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
          ref: HTTP_RESPONSE.BAD_REQUEST.ref,
          error: HTTP_RESPONSE.BAD_REQUEST.error,
          message: HTTP_RESPONSE.BAD_REQUEST.message,
          info: updateMilestoneResp.message,
        });
      }
      return response.status(200).send({
        type: "SUCCESS",
        data: {
          milestone: updateMilestoneResp.projectInfo,
        },
      });
    }
  } catch (error) {
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
        info: error.message,
      });
  }
}

exports.deleteMilestone = async(request, response) => {
  try {
    const milestoneId = request.params.milestoneId;

    const isMilestoneIdValid = commonValidatorObj.objectIdValidator(milestoneId);

    if (!isMilestoneIdValid) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: "Invalid ID provided.",
      });
    }

    const deleteMilestoneResp = await milestoneHelperObj.deleteProject(milestoneId);

    if (deleteMilestoneResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: deleteMilestoneResp.message,
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        project: deleteMilestoneResp.projectInfo,
      },
    });
  } catch (error) {
    return response
      .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
      .send({
        ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
        error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
        message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
        info: error.message,
      });
  }
}