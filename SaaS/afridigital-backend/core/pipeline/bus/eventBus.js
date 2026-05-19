const EventEmitter = require("events");
const bus = new EventEmitter();

function emit(event, payload = {}) {
  const eventPacket = {
    event,
    timestamp: Date.now(),
    traceId: payload.traceId || `trace_${Date.now()}`,
    payload
  };

  console.log("📡 EMIT >", eventPacket);

  bus.emit(event, eventPacket);
}

function on(event, handler) {
  bus.on(event, handler);
}

module.exports = { emit, on };
