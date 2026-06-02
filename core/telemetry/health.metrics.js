const os = require("os");
const { emitAdminEvent } = require("../../realtime/admin-stream");

let eventCount = 0;
let errorCount = 0;

process.on("uncaughtException", () => errorCount++);
process.on("unhandledRejection", () => errorCount++);

// called by instrumentation hooks
function bumpEvent() {
  eventCount++;
}

function collectMetrics() {
  const mem = process.memoryUsage();
  const cpuLoad = os.loadavg();

  return {
    ts: Date.now(),
    uptime: process.uptime(),
    memory: {
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      external: mem.external
    },
    cpu: {
      load1: cpuLoad[0],
      load5: cpuLoad[1],
      load15: cpuLoad[2]
    },
    system: {
      platform: os.platform(),
      freeMem: os.freemem(),
      totalMem: os.totalmem()
    },
    aiBrain: {
      events: eventCount,
      errors: errorCount
    }
  };
}

function startHealthStream(interval = 3000) {
  console.log("🧠 HEALTH METRICS STREAM ONLINE");

  setInterval(() => {
    const metrics = collectMetrics();

    emitAdminEvent("SYSTEM_HEALTH", {
      type: "HEALTH_TICK",
      stage: "live",
      traceId: "health-stream",
      payload: metrics
    });

  }, interval);
}

module.exports = { startHealthStream, bumpEvent };
