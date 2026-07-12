const observer = require("../observer/ws.afriai.observer");
const anomaly = require("../anomaly/ws.anomaly.engine");

function getControlFeed() {
  return {
    system: "AfriDigital WS Control Plane",
    status: "LIVE",
    timestamp: Date.now(),

    metrics: observer.stats || {
      connections: 0,
      messages: 0,
      channels: {}
    },

    anomalies: anomaly.window?.length || 0,

    health: {
      mode: "OBSERVABILITY_ONLY",
      stability: "SAFE",
      mutation: false
    }
  };
}

module.exports = { getControlFeed };
