const bus = require("../../redis/streamBus");
const { setReply } = require("../../africore/runtime/promiseStore");

function emit(event) {
  const payload = {
    ...event,
    ts: Date.now()
  };

  bus.publish(event.type || "ai.task", payload);
  return payload.traceId;
}

function on(eventType, handler) {
  bus.subscribe(eventType, async (payload) => {
    try {
      const result = await handler(payload);
      if (payload.traceId) {
        setReply(payload.traceId, result);
      }
    } catch (e) {
      if (payload.traceId) {
        setReply(payload.traceId, { error: e.message });
      }
    }
  });
}

module.exports = { emit, on };
