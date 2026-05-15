/**
 * 🐕 AFRIDIGITAL WATCHDOG ENGINE (A3.6)
 * Real-time anomaly detection + system guardian layer
 */

const { publish } = require("../runtime/bus/event.bus");
const { createEvent } = require("../event/types");

/**
 * simple risk scoring model
 */
function scoreEvent(event) {
  let score = 0;

  if (!event || !event.type) score += 40;
  if (!event.payload) score += 30;

  if (event.type === "EXECUTE" && typeof event.payload !== "object") {
    score += 20;
  }

  // timestamp anomaly
  if (event.ts && event.ts > Date.now() + 10000) {
    score += 50;
  }

  return Math.min(100, score);
}

/**
 * main watchdog inspector
 */
function inspect(event) {
  const risk = scoreEvent(event);

  if (risk > 60) {
    const alert = createEvent("WATCHDOG_ALERT", {
      risk,
      original: event,
      message: "⚠ High-risk system behavior detected"
    });

    publish(alert);
  }

  return {
    ok: risk < 60,
    risk
  };
}

/**
 * batch monitoring hook
 */
function monitorBatch(events = []) {
  return events.map(inspect);
}

module.exports = {
  inspect,
  monitorBatch,
  scoreEvent
};
