const express = require("express");
const router = express.Router();
const errorHandler = require("../../utils/error/errorHandler");
const genericViewObj = require("./views");


router.route("/user-profile/health")
    .get(genericViewObj.genericHealthcheck)
    .all(errorHandler.handle405)

router.route("/user-profile/health/:n")
    .get(genericViewObj.loadHealthCheck)
    .all(errorHandler.handle405)


module.exports = router;