const { broadcast } = require("../realtime/ws/dag.stream");
const { emit } = require("../event-spine/ci.spine");

function pushHudEvent(event) {
  const normalized = {
    node: event.type,
    state: event.state || "UNKNOWN",
    meta: event
  };

  const e = emit(event);
  broadcast(normalized);

  return e;
}

module.exports = { pushHudEvent };
