/**
 * 📊 STREAM METRICS BRIDGE (A3.7)
 * Push kernel metrics into live websocket stream
 */

const { systemHealthCheck } = require("../health/kernel.health");
const { publish } = require("../runtime/bus/event.bus");
const { createEvent } = require("../event/types");

function pushMetrics() {
  const metrics = systemHealthCheck();

  const event = createEvent("KERNEL_METRICS", metrics);

  publish(event);

  return metrics;
}

module.exports = { pushMetrics };
