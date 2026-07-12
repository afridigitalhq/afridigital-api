const bus = require("../bus/ws.afriai.eventbus");

function attachTelemetry(observer) {

  bus.on("kernel:init", (e) => {
    observer.ingest({
      type: "KERNEL_INIT",
      payload: e.payload
    });
  });

  bus.on("*", (e) => {
    observer.ingest({
      type: "TELEMETRY_EVENT",
      payload: e
    });
  });

  return {
    ok: true,
    mode: "TELEMETRY_BRIDGE_ATTACHED"
  };
}

module.exports = { attachTelemetry };
