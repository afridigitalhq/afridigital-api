const { Worker } = require("worker_threads");

function runWorker(file, payload = {}) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(file, {
      workerData: payload
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error("WORKER_EXIT_" + code));
    });
  });
}

module.exports = { runWorker };
