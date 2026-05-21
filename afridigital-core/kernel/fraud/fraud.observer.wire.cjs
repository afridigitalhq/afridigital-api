/**
 * 🧠 FRAUD OBSERVER WIRE (CONTROL PLANE LISTENER)
 * Captures all fraud system outputs
 */

const eventCore = require("../stable/event.core.cjs");
const alerts = require("../alerts/fraud.alerts.cjs");

function wireFraudObserver() {

  // ALERT LEVEL
  eventCore.on("FRAUD_ALERT", (packet) => {
    console.log("🚨 FRAUD ALERT RECEIVED");

    try {
      if (alerts?.trigger) {
        alerts.trigger(packet);
      }
    } catch (e) {
      console.log("⚠️ ALERT FAIL:", e.message);
    }
  });

  // BLOCK LEVEL (CRITICAL)
  eventCore.on("FRAUD_BLOCKED", (packet) => {
    console.log("⛔ FRAUD BLOCKED EVENT CAPTURED");

    const payload = packet?.payload || {};

    console.log("📡 BLOCK DETAILS:", {
      user: payload.user,
      tx: payload.id,
      risk: payload.riskScore
    });
  });

}

module.exports = wireFraudObserver;
