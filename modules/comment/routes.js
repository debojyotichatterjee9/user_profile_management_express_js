const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const commentViewObj = require("./views");

router
  .route("/milestone/:milestoneId/comment")
  .post(commentViewObj.createComment)
  .all(errorHandler.handle405);

  router
  .route("/milestone/:milestoneId/comments")
  .get(commentViewObj.getCommentList)
  .all(errorHandler.handle405);

router
  .route("/milestone/:milestoneId/comment/:commentId")
  .patch(commentViewObj.updateComment)
  .delete(commentViewObj.deleteComment)
  .all(errorHandler.handle405);
module.exports = router;
