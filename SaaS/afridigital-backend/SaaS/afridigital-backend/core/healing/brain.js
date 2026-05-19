/**
 * 🧠⚙️ A3.11 SELF-HEALING BRAIN
 * Detect → Diagnose → Repair → Recover
 */

const { getHistory, publish } = require("../runtime/bus/event.bus");
const { createEvent } = require("../event/types");
const { detectFailure } = require("./analyzer");
const { recoverSystem } = require("./recovery.engine");

function runHealingCycle() {
  const recentEvents = getHistory().slice(-300);

  const failureReport = detectFailure(recentEvents);

  if (!failureReport.failed) {
    return {
      status: "HEALTHY",
      message: "No healing required"
    };
  }

  const recovery = recoverSystem(failureReport);

  const event = createEvent("SELF_HEALING_ACTION", {
    failure: failureReport,
    recovery
  });

  publish(event);

  return {
    status: "HEALING_EXECUTED",
    recovery
  };
}

module.exports = { runHealingCycle };
