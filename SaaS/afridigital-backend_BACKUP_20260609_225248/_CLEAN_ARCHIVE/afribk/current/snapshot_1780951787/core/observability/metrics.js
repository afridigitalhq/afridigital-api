const startTime = Date.now();
let requestCount = 0;

function inc() {
  requestCount++;
}

function snapshot() {
  return {
    uptime: (Date.now() - startTime) / 1000,
    requests: requestCount,
    memory: process.memoryUsage()
  };
}

module.exports = { inc, snapshot };
