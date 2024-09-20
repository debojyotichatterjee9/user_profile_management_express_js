const express = require('express');
const router = express.Router();
const errorHandler = require('../../utils/error/errorHandler');
const userViewObj = require('./views');

router.route('/organization/:organizationId/user')
  .post(userViewObj.createUser)
  .all(errorHandler.handle405);

router.route('/organization/:organizationId/users')
  .get(userViewObj.getUserList)
  .all(errorHandler.handle405);

  router.route('/organization/:organizationId/user/:userId')
  .get(userViewObj.getUserDetails)
  .patch(userViewObj.updateUser)
  .delete(userViewObj.deleteUser)
  .all(errorHandler.handle405);

module.exports = router;
