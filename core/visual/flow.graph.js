function buildGraph(events = []) {
  return events.map(e => ({
    from: e.stage || "unknown",
    to: e.type,
    traceId: e.traceId
  }));
}

module.exports = { buildGraph };
