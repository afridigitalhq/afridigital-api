/**
 * ⚙ AFRIDIGITAL KERNEL HEALTH ENGINE (A3.7)
 * System-wide CPU-like observability layer
 */

const { getHistory } = require("../runtime/bus/event.bus");
const { inspect } = require("../watchdog/engine");

function computeMetrics() {
  const events = getHistory();

  const total = events.length;
  const last = events.slice(-50);

  const ingest = last.filter(e => e.type === "INGEST").length;
  const route = last.filter(e => e.type === "ROUTE").length;
  const exec = last.filter(e => e.type === "EXECUTE").length;

  return {
    totalEvents: total,
    ingestRate: ingest,
    routingRate: route,
    executionRate: exec,
    memoryFootprint: JSON.stringify(events).length,
    status: total > 0 ? "HEALTHY" : "IDLE"
  };
}

function systemHealthCheck() {
  const metrics = computeMetrics();

  const risk = metrics.totalEvents > 5000 ? "HIGH_LOAD" : "NORMAL";

  return {
    ...metrics,
    risk,
    timestamp: Date.now()
  };
}

module.exports = {
  computeMetrics,
  systemHealthCheck
};
