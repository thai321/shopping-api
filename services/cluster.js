const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

module.exports = () => {
  if (cluster.isMaster) {
    console.log('Master cluster setting up ' + numCPUs + ' workers...');
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('online', worker => {
      console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', (worker, code, signal) => {
      console.log(
        'Worker ' +
          worker.process.pid +
          ' died with code: ' +
          code +
          ', and signal: ' +
          signal
      );
      console.log('Starting a new worker');
      cluster.fork();
    });
    return false;
  } else {
    return true;
  }
};
