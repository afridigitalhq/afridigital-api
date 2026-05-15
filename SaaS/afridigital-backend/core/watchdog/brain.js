/**
 * 🧠🐕 A3.10 WATCHDOG AI BRAIN
 * Predictive anomaly detection system
 */

const { getHistory, publish } = require("../runtime/bus/event.bus");
const { createEvent } = require("../event/types");
const { scoreAnomaly } = require("./anomaly.scorer");
const { predictRisk } = require("./predictor.engine");

function analyzeSystem() {
  const events = getHistory().slice(-200);

  const signals = events.map(e => ({
    type: e.type,
    ts: e.ts,
    payloadSize: JSON.stringify(e.payload || {}).length
  }));

  const anomalyScore = scoreAnomaly(signals);
  const riskPrediction = predictRisk(signals);

  const decision = {
    anomalyScore,
    riskPrediction,
    status:
      anomalyScore > 0.7 ? "CRITICAL" :
      anomalyScore > 0.4 ? "WARNING" : "NORMAL"
  };

  const event = createEvent("WATCHDOG_AI_DECISION", decision);
  publish(event);

  return decision;
}

module.exports = { analyzeSystem };
