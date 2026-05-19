/**
 * 🚨 ALERT ENGINE (A3.10)
 */

const { publish } = require("../runtime/bus/event.bus");
const { createEvent } = require("../event/types");

function triggerAlert(decision) {
  if (decision.status === "NORMAL") return;

  const alert = createEvent("WATCHDOG_ALERT", {
    risk: decision.status,
    score: decision.anomalyScore,
    message:
      decision.status === "CRITICAL"
        ? "System instability predicted"
        : "Warning: unusual system behavior detected"
  });

  publish(alert);

  return alert;
}

module.exports = { triggerAlert };
