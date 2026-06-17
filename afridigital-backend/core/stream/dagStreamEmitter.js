const { EventEmitter } = require("events");
const emitter = new EventEmitter();

function emitDagEvent(raw) {
  const event = {
    id: raw.id,
    type: raw.type || "NODE_UPDATE",
    status: raw.status || "OK",

    node: {
      id: raw.nodeId,
      region: raw.region || "default",
      latency: raw.latency || 0,
      load: raw.load || 0
    },

    trace: {
      correlationId: raw.correlationId || null,
      source: raw.source || "kernel"
    },

    timestamp: Date.now(),

    meta: {
      version: "V12.5",
      sourceLayer: "backend"
    }
  };

  emitter.emit("dag:event", event);
  return event;
}

module.exports = { emitter, emitDagEvent };
