const express = require('express');
var morgan = require('morgan');
const winston = require('../config/winston');

const config = require('config');
const routes = require('./routes')



module.exports = () => {

    const app = express()
    app.use(morgan('combined', { stream: winston.stream }));
    routes(app);
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
    });
}