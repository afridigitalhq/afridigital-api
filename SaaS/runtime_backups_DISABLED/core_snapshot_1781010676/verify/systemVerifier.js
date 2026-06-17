const fs = require("fs");

function check(path) {
  try { return fs.existsSync(path); } catch { return false; }
}

function verifySystem() {
  const report = {
    backend: check("server.js"),
    kernel_v7: check("core/kernel/afriKernelV7.js"),
    event_bus: check("core/bus/eventBus.js"),
    queue: check("logs/queue/eventQueue.json"),
    webhook: check("routes/webhook.js"),
    watchdog: check("core/watchdog/kernelWatchdog.js"),
    recovery: check("core/recovery/bootRecovery.js"),
    sender: check("core/whatsapp/sender.js"),
  };

  const score = Object.values(report).filter(Boolean).length;

  return {
    status: score === Object.keys(report).length ? "HEALTHY" : "DEGRADED",
    score,
    total: Object.keys(report).length,
    report
  };
}

module.exports = { verifySystem };
