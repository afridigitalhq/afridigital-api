function createEvent(type, payload) {
  return {
    id: "EVT_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    type,
    ts: Date.now(),
    payload
  };
}

module.exports = { createEvent };
