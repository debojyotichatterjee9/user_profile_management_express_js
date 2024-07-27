const express = require('express');
const router = express.Router();
const errorHandler = require('../../utils/error/errorHandler');
const userViewObj = require('./views');

router.route('/user-profile-management/user')
  .post(userViewObj.createUser)
  .all(errorHandler.handle405);

router.route('/user-profile-management/users')
  .get(userViewObj.getUserList)
  .all(errorHandler.handle405);

  router.route('/user-profile-management/user/:userId')
  .get(userViewObj.getUserDetails)
  .all(errorHandler.handle405);

router.route('/user-profile-management/user/:userId')
  .patch(userViewObj.updateUser)
  .all(errorHandler.handle405);

module.exports = router;
