const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const commentViewObj = require("./views");

router
  .route("/user-profile-management/comment")
  .post(commentViewObj.createComment)
  .all(errorHandler.handle405);

  router
  .route("/user-profile-management/comments")
  .get(commentViewObj.getCommentList)
  .all(errorHandler.handle405);

router
  .route("/user-profile-management/comment/:commentId")
  .patch(commentViewObj.updateComment)
  .delete(commentViewObj.deleteComment)
  .all(errorHandler.handle405);
module.exports = router;
