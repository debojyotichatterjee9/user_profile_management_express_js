const HTTP_RESPONSE = require("../../constants/http-generic-codes.js");
const createCommentValidatorUtilObj = require("../../utils/validators/joi_create_comment_validator.js");
const commentHelperObj = require("./helpers");
const commonValidatorObj = require("../../utils/validators/common-validators.js");
const updateCommentValidatorUtilObj = require("../../utils/validators/joi_update_comment_validator.js");

exports.createComment = async (request, response) => {
  try {
    const [payload] = [request.body];

    const validation =
      createCommentValidatorUtilObj.createCommentValidation(payload);
    if (validation.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        error: validation.error.message,
      });
    } else {
      if (validation.value) {
        const createCommentResp = await commentHelperObj.createComment(
          payload
        );
        if (createCommentResp.errorFlag) {
          return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
            ref: HTTP_RESPONSE.BAD_REQUEST.ref,
            error: HTTP_RESPONSE.BAD_REQUEST.error,
            message: createCommentResp.message,
          });
        }
        return response.status(201).send({
          ref: "SUCCESS",
          data: {
            comment: {
              id: createCommentResp.commentInfo._id,
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

exports.getCommentList = async (request, response) => {
  try {
    const queryParams = request.query;
    const commentListResp = await commentHelperObj.getCommentList(
      queryParams
    );
    if (commentListResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info:
          commentListResp?.message ?? "Unable to fetch comment list.",
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        total_comments: commentListResp.total_projects,
        total_filtered_comments: commentListResp.total_filtered_comments,
        page: commentListResp.page,
        limit: commentListResp.limit,
        comment_list: commentListResp.comment_list,
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


exports.updateComment = async (request, response) => {
  try {
    const [commentId, payload] = [request.params.commentId, request.body];

    const isCommentIdValid =
      commonValidatorObj.objectIdValidator(commentId);

    if (!isCommentIdValid) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: "Invalid ID provided.",
      });
    }

    const validationResp =
      updateCommentValidatorUtilObj.updateCommentValidation(payload);

    if (validationResp.error) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: validationResp.error.details,
      });
    } else {
      const updateCommentResp = await commentHelperObj.updateProject(
        commentId,
        payload
      );
      if (updateCommentResp.errorFlag) {
        return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
          ref: HTTP_RESPONSE.BAD_REQUEST.ref,
          error: HTTP_RESPONSE.BAD_REQUEST.error,
          message: HTTP_RESPONSE.BAD_REQUEST.message,
          info: updateCommentResp.message,
        });
      }
      return response.status(200).send({
        type: "SUCCESS",
        data: {
          comment: updateCommentResp.commentInfo,
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
};

exports.deleteComment = async (request, response) => {
  try {
    const commentId = request.params.milestoneId;

    const isCommentIdValid =
      commonValidatorObj.objectIdValidator(commentId);

    if (!isCommentIdValid) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: "Invalid ID provided.",
      });
    }

    const deleteCommentResp = await commentHelperObj.deleteComment(
      commentId
    );

    if (deleteCommentResp.errorFlag) {
      return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
        error: HTTP_RESPONSE.BAD_REQUEST.error,
        message: HTTP_RESPONSE.BAD_REQUEST.message,
        info: deleteCommentResp.message,
      });
    }
    return response.status(200).send({
      type: "SUCCESS",
      data: {
        comment: deleteCommentResp.commentInfo,
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