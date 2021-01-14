const express = require('express');
const config = require('config');
const port = 3000



module.exports = () => {

    const app = express()
    app.get('/', (req, res) => {
        res.send(req.headers)
    })

    return new Promise((resolve, reject) => {
        try {
            const port = config.get('services').rest.port;
            const host = config.get('services').rest.host;
            const server = app.listen(port, host, () => {
                console.log(`Profile Management listening at http://localhost:${port}`);
                resolve(server);
            })
        }
        catch (error) {
            reject(error);
        }
    })
}