const express = require('express');
var morgan = require('morgan');
const expressRequestId = require('express-request-id')();
const { graphqlHTTP } = require("express-graphql");
const winston = require('../utils/logger_utils/winston');
const bunyan = require("../utils/logger_utils/bunyan")
const config = require('config');
const routes = require('./routes')
const graphqlSchema = require("../graphql/schema");
const graphqlResolvers = require("../graphql/resolvers");

module.exports = () => {

    const app = express()
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(expressRequestId)
    app.use("/graphql", graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true
    }));
    morgan.token('id', function getId(req) {
        return req.id
    });

    /**
     * Morgan Logger
     */
    // app.use(morgan('combined', { stream: process.stdout }));

    /**
     * Winston Logger
     */
    app.use(morgan('combined', { stream: winston.stream }));

    /**
     * Bunyan Logger
     */
    // app.use((req, res, next) => {
    //     var log = bunyan.logger.child({
    //         id: req.id,
    //         // body: req.body
    //     }, true)
    //     log.trace({
    //         req: req
    //     },'Request')
    //     next();
    // });

    // app.use(function (req, res, next) {
    //     function afterResponse() {
    //         res.removeListener('finish', afterResponse);
    //         res.removeListener('close', afterResponse);
    //         var log = bunyan.logger.child({
    //             id: req.id,
    //             // body: res.body,
    //             statusCode: res.statusCode
    //         }, true)
    //         log.trace({ res: res }, 'Response')
    //     }

    //     // res.on('finish', afterResponse);
    //     res.on('close', afterResponse);
    //     next();
    // });

    routes(app);
    return new Promise((resolve, reject) => {
        try {
            const port = process.env.PORT || config.get('services').rest.port;
            const host = config.get('services').rest.host;
            const server = app.listen(port, host, () => {
                // console.log(`Profile Management listening at http://localhost:${port}`);
                resolve(server);
            })
        }
        catch (error) {
            reject(error);
        }
    });
}