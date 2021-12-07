const winstonLogger = require("../../utils/logger_utils/winston")


exports.genericHealthcheck = (request, response) => {
    request.headers.status = "OK!!!!!!!!!!!!!!!!"
    winstonLogger.info(process.env.PORT)
    response.status(200).send(request.headers);
}

exports.loadHealthCheck = (request, response) => {
    let n = parseInt(request.params.n);
    let count = 0;
    for (let i = 1; i <= n; i++) {
        count += 1;
    }
    response.status(200).send({
        iterations: count
    });
}