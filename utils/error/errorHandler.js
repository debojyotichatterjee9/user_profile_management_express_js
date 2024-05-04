const errorMessage = require("./errorMessages.json");

exports.handle404 = (rquest, response) => {
    return response.status(404).send({
        error: errorMessage.pathNotFound
    });
}

exports.handle405 = (rquest, response) => {
    return response.status(405).send({
        error: errorMessage.methodNotAllowed
    });
}

