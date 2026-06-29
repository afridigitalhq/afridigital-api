function analyze(events = []) {
  return {
    total: events.length,
    dispatches: events.filter(e => e.type === "dispatch").length,
    emits: events.filter(e => e.type === "emit").length,
    status: "STABLE"
  };
}

module.exports = { analyze };
