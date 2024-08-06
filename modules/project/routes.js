const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const projectViewObj = require("./views");

router
  .route("/user-profile-management/project")
  .post(projectViewObj.createProject)
  .all(errorHandler.handle405);

  router
  .route("/user-profile-management/projects")
  .get(projectViewObj.getProjectList)
  .all(errorHandler.handle405);

router
  .route("/user-profile-management/project/:projectId")
  .get(projectViewObj.getProjectDetails)
  .patch(projectViewObj.updateProject)
  .delete(projectViewObj.deleteProject)
  .all(errorHandler.handle405);
module.exports = router;
