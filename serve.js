const cluster = require('cluster');
const os = require("os");
const config = require('config');
const mongoose = require('mongoose');
const winstonLogger = require("./utils/logger_utils/winston");
const bunyan = require("./utils/logger_utils/bunyan");
const log = bunyan.logger;
let workers = [];
const setupWorkerProcesses = () => {
  // to read number of cores on system
  const port = process.env.PORT || config.get('services').rest.port;
  const host = config.get('services').rest.host;
  let numCores = require('os').cpus().length;
  winstonLogger.info('Master cluster setting up ' + numCores + ' workers');
  // iterate on number of cores need to be utilized by an application
  // current example will utilize all of them
  for (let i = 0; i < numCores; i++) {
    // creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[i].on('message', function(message) {
      console.log(message);
    });
  }
  // process is clustered on a core and process id is assigned
  cluster.on('online', function(worker) {
    winstonLogger.info(`Worker ${worker.process.pid} on http://${host}:${port} is online!!`);
  });
  // if any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    if (code !== 1) {
      console.log('Starting a new worker...');
      cluster.fork();
      workers.push(cluster.fork());
      // to receive messages from worker process
      workers[workers.length - 1].on('message', function(message) {
        console.log(message);
      });
    }
  });
};
const setUpExpress = () => {
  const mongodbURI = config.get('database').mongo_uri;
  mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    retryWrites: false,
    // useCreateIndex: true
  }).then(() => {
    winstonLogger.info(`Connected to MongoDB: ${mongodbURI}`);
    // clearTimeout(reSetupDelay);
  }).catch(err => {
    winstonLogger.error(`Error connecting to MongoDB: ${mongodbURI}`);
    // winstonLogger.error(err);
    console.log(err)
    // const reSetupDelay = setTimeout(setUpExpress, 5000);
  });
  const rest = require('./services/rest')();
  return Promise.all([rest]);
}
const setupServer = (isClusterRequired) => {
  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // to setup server configurations and share port address for incoming requests
    setUpExpress();
  }
};
setupServer(true)
