function normalize(event) {
  return {
    id: event.ts + "-" + Math.random().toString(16).slice(2),
    label: event.event.type || "EVENT",
    meta: event.event,
    ts: event.ts
  };
}

module.exports = { normalize };
