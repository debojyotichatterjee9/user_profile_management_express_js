const express = require('express');
const router = express.Router();
const errorHandler = require('../../utils/error/errorHandler');
const organizationViewObj = require('./views');

router.route('/user-profile-management/user')
    .post(organizationViewObj.createOrganization)
    .all(errorHandler.handle405);

router.route('/user-profile-management/user/list')
    .get(organizationViewObj.getOrganizationList)
    .all(errorHandler.handle405);

router.route('/user-profile-management/user/:userId')
    .put(organizationViewObj.updateOrganization)
    .all(errorHandler.handle405);

module.exports = router;
