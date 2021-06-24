
exports.genericHealthcheck = (request, response) => {
    request.headers.status = "OK"
    response.status(200).send(request.headers);
}

exports.loadHealthCheck = (request, response) => {
    let n = parseInt(req.params.n);
    let count = 0;
    for (let i = 1; i <= n; i++) {
        count += 1;
    }
    res.status(200).send({
        iterations: count
    });
}