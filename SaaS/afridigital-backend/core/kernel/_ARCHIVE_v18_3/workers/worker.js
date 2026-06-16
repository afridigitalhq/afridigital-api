const { Worker } = require("worker_threads");

function spawnWorker(file, data = {}) {
  return new Promise((resolve, reject) => {
    const w = new Worker(file, { workerData: data });

    w.on("message", resolve);
    w.on("error", reject);
    w.on("exit", (code) => {
      if (code !== 0) reject(new Error("Worker exited with " + code));
    });
  });
}

module.exports = { spawnWorker };
