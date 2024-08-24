const HTTP_RESPONSE = require("../../constants/http-generic-codes.js");
const createProjectValidatorUtilObj = require("../../utils/validators/joi_create_project_validator.js");
const projectHelperObj = require("./helpers");
const commonValidatorObj = require("../../utils/validators/common-validators.js");
const updateProjValidatorUtilObj = require("../../utils/validators/joi_update_project_validator.js")

exports.createProject = async (request, response) => {
  try {
    const [payload] = [request.body];

    const validation =
    createProjectValidatorUtilObj.createProjectValidation(payload);
    if (validation.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        error: validation.error.message,
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
            message: createProjectResp.message,
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

exports.getProjectList = async (request, response) => {
  try {
    const queryParams = request.query;
    const projectListResp =
      await projectHelperObj.getProjectList(queryParams);
    if (projectListResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info:
        projectListResp?.message ?? "Unable to fetch organization list.",
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        total_projectss: projectListResp.total_projects,
        total_filtered_projects: projectListResp.total_filtered_projects,
        page: projectListResp.page,
        limit: projectListResp.limit,
        project_list: projectListResp.project_list,
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

exports.getProjectDetails = async (request, response) => {
  try {
    const projectId = request.params.projectId;
    const projectDetailsResp =
      await projectHelperObj.getProjectInfoById(
        projectId
      );
    if (projectDetailsResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info:
        projectDetailsResp?.message ??
          "Unable to fetch project list.",
      });
    }
    if (!projectDetailsResp) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.NOT_FOUND.ref,
        error: HTTP_RESPONSE.NOT_FOUND.error,
        message: HTTP_RESPONSE.NOT_FOUND.message,
        info: projectDetailsResp.message,
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        project: projectDetailsResp,
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

exports.updateProject = async(request, response) => {
  try {
    const [projectId, payload] = [request.params.projectId, request.body];

    const isProjectIdValid = commonValidatorObj.objectIdValidator(projectId);

    if (!isProjectIdValid) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: "Invalid ID provided.",
      });
    }

    const validationResp = updateProjValidatorUtilObj.updateProjectValidation(payload);

    if (validationResp.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: validationResp.error.details,
      });
    } else {
      const updateProjectResp = await projectHelperObj.updateProject(projectId, payload);
      if (updateProjectResp.errorFlag) {
        return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
          ref: HTTP_RESPONSE.BAD_REQUEST.ref,
          error: HTTP_RESPONSE.BAD_REQUEST.error,
          message: HTTP_RESPONSE.BAD_REQUEST.message,
          info: updateProjectResp.message,
        });
      }
      return response.status(200).send({
        type: "SUCCESS",
        data: {
          project: updateProjectResp.projectInfo,
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

exports.deleteProject = async(request, response) => {
  try {
    const projectId = request.params.projectId;

    const isProjectIdValid = commonValidatorObj.objectIdValidator(projectId);

    if (!isProjectIdValid) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: "Invalid ID provided.",
      });
    }

    const deleteProjectResp = await projectHelperObj.deleteProject(projectId);

    if (deleteProjectResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: deleteProjectResp.message,
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        project: deleteProjectResp.projectInfo,
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