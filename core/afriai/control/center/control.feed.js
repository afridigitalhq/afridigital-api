const bus = require("./control.bus");

function getControlCenterFeed() {
  const snap = bus.snapshot();

  return {
    system: snap.system,
    status: "LIVE",
    health: "SAFE",
    ts: snap.ts,

    ai: snap.state.ai.length,
    kernel: snap.state.kernel.length,
    plugins: snap.state.plugins.length,
    ws: snap.state.ws.length,
    anomalies: snap.state.anomalies.length
  };
}

module.exports = { getControlCenterFeed };
