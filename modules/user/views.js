

exports.createUser = (request, response) => {
    response.status(201).send({
        message: "user created"
    })
}