const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const milestoneViewObj = require("./views");

router
  .route("/user-profile-management/milestone")
  .post(milestoneViewObj.createMilestone)
  .all(errorHandler.handle405);

  router
  .route("/user-profile-management/milestones")
  .get(milestoneViewObj.getMilestoneList)
  .all(errorHandler.handle405);

router
  .route("/user-profile-management/milestone/:milestoneId")
  .get(milestoneViewObj.getMilestoneDetails)
  .patch(milestoneViewObj.updateMilestone)
  .delete(milestoneViewObj.deleteMilestone)
  .all(errorHandler.handle405);
module.exports = router;
