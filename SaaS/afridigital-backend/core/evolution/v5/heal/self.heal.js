/**
 * ⚙ A3.18 SAFE AUTO-HEALING (CONTROLLED MODE)
 * ONLY detects issues — does NOT execute rollback automatically
 */

const { getHistory } = require("../../event/bus");

function detectAnomaly() {
  const history = getHistory() || [];

  const recent = history.slice(-20);

  const errorCount = recent.filter(e => e.type === "ERROR").length;

  return {
    anomalyDetected: errorCount > 6,
    errorRate: errorCount / 20
  };
}

/**
 * IMPORTANT:
 * This version does NOT execute rollback automatically.
 * It only RETURNS recommendation for admin/watchdog.
 */
function healSystem() {
  const status = detectAnomaly();

  if (status.anomalyDetected) {
    return {
      status: "RECOMMEND_ROLLBACK",
      reason: "High error density detected in event stream",
      severity: status.errorRate
    };
  }

  return {
    status: "STABLE",
    reason: "System operating within safe thresholds"
  };
}

module.exports = { detectAnomaly, healSystem };
