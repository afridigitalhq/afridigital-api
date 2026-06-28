// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
function normalize(event) {
  return {
    source: event.source || "unknown",
    type: event.type || "GENERIC",
    payload: event.payload || {},
    timestamp: event.timestamp || Date.now(),
    traceId: event.traceId || `${Date.now()}-${Math.random()}`
  };
}

module.exports = { normalize };
