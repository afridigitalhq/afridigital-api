const bus = require("./telemetry.bus");

function startGraphStream() {

  setInterval(() => {
    bus.emit("telemetry", {
      type: "GRAPH_UPDATE",
      timestamp: Date.now(),
      nodes: process.pid,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    });

  }, 1500);

  console.log("📡 AFRISCAN GRAPH STREAM ACTIVE");
}

module.exports = startGraphStream;
