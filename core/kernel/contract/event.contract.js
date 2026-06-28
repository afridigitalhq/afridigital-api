// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
function normalizeEvent(event) {
  return {
    id: event.id || `${Date.now()}-${Math.random()}`,
    type: event.type || "UNKNOWN",
    source: event.source || "adapter",
    payload: event.payload || {},
    ts: Date.now()
  };
}

function validateEvent(event) {
  return !!(event && event.type);
}

module.exports = { normalizeEvent, validateEvent };
