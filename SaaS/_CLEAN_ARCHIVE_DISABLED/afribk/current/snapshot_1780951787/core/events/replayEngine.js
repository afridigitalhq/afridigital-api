const eventLog = require("./eventLog");

/**
 * Deterministic replay (CAUSAL ORDER)
 */
function replay({ traceId = null } = {}) {
  const events = eventLog.readAll();

  if (!traceId) {
    return events;
  }

  return events.filter(e => e && e.traceId === traceId);
}

/**
 * Build deterministic memory state
 */
function rebuildMemory() {
  const events = eventLog.readAll();

  const memory = {};
  const graph = [];

  for (const e of events) {
    if (!e) continue;

    graph.push(e);

    if (e.type === "memory:set" && e.payload) {
      memory[e.payload.key] = e.payload.value;
    }

    if (e.type === "memory:delete" && e.payload) {
      delete memory[e.payload.key];
    }
  }

  return {
    memory,
    graph,
    eventCount: events.length
  };
}

module.exports = {
  replay,
  rebuildMemory
};
