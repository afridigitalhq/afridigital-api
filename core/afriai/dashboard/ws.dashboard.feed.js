const telemetry = require("../telemetry/ws.telemetry");

function getDashboardState() {
  return {
    system: "AfriDigital WS",
    status: "LIVE",
    telemetry: telemetry.snapshot(),
    kernel: "v4-safe",
    mode: "OBSERVABILITY_ONLY"
  };
}

module.exports = { getDashboardState };
