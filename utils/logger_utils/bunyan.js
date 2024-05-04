var bunyan = require('bunyan');
var appRoot = require('app-root-path');



exports.logger = bunyan.createLogger({
    name: "User Profile Management",                     // Required
    // level: "info",      // Optional, see "Levels" section
    // stream: process.stdout,           // Optional, see "Streams" section
    streams: [
        {
            level: "fatal",
            stream: process.stdout,
            // type: 'rotating-file',
            // path: `${appRoot}/logs/exceptions.log`,
            // period: '1d',   // daily rotation
            // count: 3        // keep 3 back copies
        },
        {
            level: "error",
            stream: process.stdout,
            // type: 'rotating-file',
            // path: `${appRoot}/logs/errors.log`,
            // period: '1d',   // daily rotation
            // count: 3        // keep 3 back copies
        },
        {
            level: "warn",
            stream: process.stdout,
            // type: 'rotating-file',
            // path: `${appRoot}/logs/errors.log`,
            // period: '1d',   // daily rotation
            // count: 3        // keep 3 back copies
        },
        {
            level: "info",
            stream: process.stdout,
            // type: 'rotating-file',
            // path: `${appRoot}/logs/app.log`,
            // period: '1d',   // daily rotation
            // count: 3        // keep 3 back copies
        },
        {
            level: "debug",
            stream: process.stdout,
        },
        {
            level: "trace",
            stream: process.stdout,
            // type: 'rotating-file',
            // path: `${appRoot}/logs/trace.log`,
            // period: '1d',   // daily rotation
            // count: 3        // keep 3 back copies
        }
    ],   // Optional, see "Streams" section
    serializers: bunyan.stdSerializers, // Optional, see "Serializers" section
    src: true,                     // Optional, see "src" section

    // Any other fields are added to all log records as is.
    foo: 'bar',
});

exports.logResponse = function (id, body, statusCode) {
    var log = this.loggerInstance.child({
        id: id,
        // body: body,
        statusCode: statusCode
    }, true)
    log.trace('Response')
}
// module.exports = logger;