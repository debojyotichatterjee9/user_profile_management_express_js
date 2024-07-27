const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const organizationViewObj = require("./views");

router
  .route("/user-profile-management/organization")
  .post(organizationViewObj.createOrganization)
  .all(errorHandler.handle405);

router
  .route("/user-profile-management/organizations")
  .get(organizationViewObj.getOrganizationList)
  .all(errorHandler.handle405);

router
  .route("/user-profile-management/organization/:organizationId")
  .get(organizationViewObj.getOrganizationDetails)
  .all(errorHandler.handle405);

module.exports = router;
