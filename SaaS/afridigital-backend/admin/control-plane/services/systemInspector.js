const fs = require("fs");
const os = require("os");

function inspectSystem(){
  return {
    status: "ONLINE",
    kernel: fs.existsSync("core/kernel/afriKernelV7.js"),
    bootstrap: fs.existsSync("core/bootstrap.js"),
    observe: fs.existsSync("core/observe/tracer.js"),
    queue: fs.existsSync("core/queue/eventQueue.js"),
    watchdog: fs.existsSync("core/watchdog/kernelWatchdog.js"),

    memory: process.memoryUsage(),

    cpu: {
      loadavg: os.loadavg(),
      cpus: os.cpus().length
    },

    uptime: process.uptime(),

    timestamp: Date.now()
  };
}

module.exports = { inspectSystem };
