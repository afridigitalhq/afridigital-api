const killSwitch = require('../security/kill.switch.cjs');
/**
 * 🧠 FRAUD PIPELINE WIRE (CONTROL PLANE LINKER)
 * Ensures FRAUD_BLOCKED propagates system-wide
 */

const eventCore = require("../stable/event.core.cjs");
const alerts = require("../alerts/fraud.alerts.cjs");

function wireFraudPipeline() {

  // GLOBAL BLOCK EVENT
  eventCore.on("FRAUD_BLOCKED", (packet) => {

    console.log("🚨 FRAUD PIPELINE ACTIVATED");
    killSwitch.block(packet);

    // 1. Alert system fanout
    try {
      if (alerts?.trigger) {
        alerts.trigger(packet);
      }
    } catch (e) {
      console.log("⚠️ ALERT FAIL:", e.message);
    }

    // 2. Admin visibility hook
    console.log("📡 BLOCKED TRANSACTION:", {
      id: packet?.payload?.id,
      user: packet?.payload?.user,
      score: packet?.payload?.riskScore
    });

  });
}

module.exports = wireFraudPipeline;
