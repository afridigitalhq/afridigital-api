const bus = require("../core/context.cjs");
const EVENTS = require("../event-bus/registry.cjs");

function sync(status) {
  if (status === "ok") {
    bus.emit(EVENTS.RENDER_HEALTH_OK, {});
  } else {
    bus.emit(EVENTS.RENDER_HEALTH_FAIL, {});
  }
}

module.exports = { sync };
