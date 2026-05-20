const bus = require("../core/context.cjs");
const EVENTS = require("../../afridigital-core/kernel/event-bus/registry.cjs");

function sync(status) {
  if (status === "ok") {
    bus.emit(EVENTS.RENDER_HEALTH_OK, {});
  } else {
    bus.emit(EVENTS.RENDER_HEALTH_FAIL, {});
  }
}

module.exports = { sync };
