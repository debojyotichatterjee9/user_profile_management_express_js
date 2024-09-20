const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const organizationViewObj = require("./views");

router
  .route("/organization")
  .post(organizationViewObj.createOrganization)
  .all(errorHandler.handle405);

router
  .route("/organizations")
  .get(organizationViewObj.getOrganizationList)
  .all(errorHandler.handle405);

router
  .route("/organization/:organizationId")
  .get(organizationViewObj.getOrganizationDetails)
  .patch(organizationViewObj.updateOrganization)
  .delete(organizationViewObj.deleteOrganization)
  .all(errorHandler.handle405);

module.exports = router;
