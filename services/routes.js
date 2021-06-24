const bunyan = require("../utils/bunyan");
const winstonLogger = require("../utils/winston");
const log = bunyan.logger;

const genericViewObj = require("../modules/generic/views")
const userViewObj = require("../modules/user/views")



module.exports = function(app) {
    
    app.get('/health', genericViewObj.genericHealthcheck);

    app.get('/health/:n', genericViewObj.loadHealthCheck);

    app.post("/user/create", userViewObj.createUser);
};