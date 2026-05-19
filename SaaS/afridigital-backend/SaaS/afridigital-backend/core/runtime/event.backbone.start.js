const hub = require("../realtime/event.hub");
const stream = require("../journal/event.stream");

function startEventBackbone() {
  console.log("⚡ AfriBank Event Backbone v1 ACTIVE");

  // CORE PIPELINE: HUB → JOURNAL
  hub.on("event", (event) => {
    try {
      stream.publish(event);
    } catch (e) {
      console.log("Journal stream error:", e.message);
    }
  });

  // HEARTBEAT
  setInterval(() => {
    hub.emitEvent({
      type: "system.backbone.heartbeat",
      ts: Date.now(),
      payload: {
        status: "ACTIVE",
        layer: "v1"
      }
    });
  }, 5000);
}

module.exports = startEventBackbone;
