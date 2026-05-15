/**
 * 💰 REVENUE TELEMETRY HOOK (A3.7)
 * Tracks monetization signals from system events
 */

const { getHistory } = require("../runtime/bus/event.bus");

function revenueSignals() {
  const events = getHistory();

  const execs = events.filter(e => e.type === "EXECUTE").length;
  const ingests = events.filter(e => e.type === "INGEST").length;

  return {
    transactions: execs,
    systemLoad: ingests,
    estimatedRevenueScore: execs * 0.12
  };
}

module.exports = { revenueSignals };
