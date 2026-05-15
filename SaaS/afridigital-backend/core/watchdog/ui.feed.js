/**
 * 🐕 WATCHDOG UI FEED (A3.7)
 * Converts alerts into dashboard-ready stream events
 */

const { getHistory } = require("../runtime/bus/event.bus");

function getAlerts() {
  return getHistory()
    .filter(e => e.type === "WATCHDOG_ALERT")
    .slice(-100)
    .map(e => ({
      risk: e.payload.risk,
      message: e.payload.message,
      ts: e.ts
    }));
}

module.exports = { getAlerts };
