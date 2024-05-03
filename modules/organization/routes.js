const express = require('express');
const router = express.Router();
const errorHandler = require('../../utils/error/errorHandler');
const organizationViewObj = require('./views');

router.route('/user-profile-management/organization')
    .post(organizationViewObj.createOrganization)
    .all(errorHandler.handle405);

module.exports = router;
