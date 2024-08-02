const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const projectViewObj = require("./views");

router
  .route("/user-profile-management/project")
  .post(projectViewObj.createProject)
  .all(errorHandler.handle405);