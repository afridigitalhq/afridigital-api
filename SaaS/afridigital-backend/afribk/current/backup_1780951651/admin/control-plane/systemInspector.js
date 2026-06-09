const fs = require("fs");

function systemInspector() {
  return {
    timestamp: Date.now(),

    backend: fs.existsSync("server.js"),
    kernel_v7: fs.existsSync("core/kernel/afriKernelV7.js"),
    queue: fs.existsSync("core/queue/eventQueue.js"),
    watchdog: fs.existsSync("core/watchdog/kernelWatchdog.js"),
    recovery: fs.existsSync("core/recovery/bootRecovery.js"),
    observe: fs.existsSync("core/observe/metrics.js"),
    sender: fs.existsSync("core/whatsapp/sender.js"),

    runtime: {
      node: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };
}

module.exports = { systemInspector };
