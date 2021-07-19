const bunyan = require("../utils/bunyan");
const winstonLogger = require("../utils/winston");
const log = bunyan.logger;

const genericViewObj = require("../modules/generic/views")
const userViewObj = require("../modules/user/views")
const authViewObj = require("../modules/authentication/views")



module.exports = function (app) {

    app.get('/user-profile/health', genericViewObj.genericHealthcheck);

    app.get('/user-profile/health/:n', genericViewObj.loadHealthCheck);

    app.post("/user-profile/user/create", userViewObj.createUser);

    app.post("/user-profile/user/login", authViewObj.login);
};