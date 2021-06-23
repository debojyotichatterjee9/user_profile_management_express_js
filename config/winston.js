var appRoot = require('app-root-path');
var winston = require('winston');
var {Loggly} = require('winston-loggly-bulk');

// need to setup later again
// winston.add(new Loggly({
//     token: "",
//     subdomain: "",
//     tags: ["Winston-NodeJS"],
//     json: true
// }));

// define the custom settings for each transport (file, console)
var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    http: {
        level: 'warn',
        filename: `${appRoot}/logs/http.log`,
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    console: {
        level: 'debug',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        handleExceptions: true,
        colorize: true,
    },
    exception: {
        level: 'warn',
        filename: `${appRoot}/logs/exceptions.log`,
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Http(options.http),
        new winston.transports.Console(options.console)
    ],
    exceptionHandlers: [
        new winston.transports.File(options.exception)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

logger.on('error', function (err) {
    console.log("WINSTON ERROR!");
});
logger.on('finish', function (info) {
    console.log("All `info` log messages has now been logged -- Finished");
});

// logger.end();
module.exports = logger;