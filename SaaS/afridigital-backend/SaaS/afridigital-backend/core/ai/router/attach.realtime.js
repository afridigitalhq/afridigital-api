/**
 * ⚡ A3.18.12 REAL-TIME ACTIVATION HOOK
 * THIS is what makes AfriAI "live"
 */

const { safeHandle } = require("../orchestrator/safe.orchestrator");

function attachRealtimeAI(bus) {

  bus.subscribe("LEGACY_EVENT_BLOCKED", (event) => {
    safeHandle(event);
  };

}

module.exports = { attachRealtimeAI };
