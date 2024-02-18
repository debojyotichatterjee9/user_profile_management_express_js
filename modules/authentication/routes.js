const express = require('express');
const router = express.Router();
const errorHandler = require('../../utils/error/errorHandler');
const authViewObj = require('./views');

router.route('/user-profile-management/user/login')
  .post(authViewObj.login)
  .all(errorHandler.handle405);

router.route('/user-profile-management/user/validate')
  .get(authViewObj.validateSession)
  .all(errorHandler.handle405);

module.exports = router;
