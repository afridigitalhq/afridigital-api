const { emitAdminEvent } = require("../../realtime/admin-stream");

function traceEvent(type, stage, traceId, payload = {}) {

  const event = {
    type,
    stage,
    traceId,
    payload,
    ts: Date.now()
  };

  emitAdminEvent("TRACE", event);

  return event;
}

module.exports = {
  traceEvent
};
