const bus = require('../core/bus/event.bus');

const retryQueue = [];

exports.addRetry = (job) => {
  retryQueue.push({
    ...job,
    retries: (job.retries || 0) + 1,
    nextRun: Date.now() + 5000
  });
};

const processRetries = async () => {
  const now = Date.now();

  for (let i = 0; i < retryQueue.length; i++) {
    const job = retryQueue[i];

    if (job.nextRun <= now) {
      bus.publish(job.event);
      retryQueue.splice(i, 1);
      i--;
    }
  }
};

setInterval(processRetries, 3000);

module.exports = { addRetry };
