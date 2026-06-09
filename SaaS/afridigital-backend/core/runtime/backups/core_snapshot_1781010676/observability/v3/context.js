function createSpan(type, traceId, parentSpanId = null) {
  return {
    traceId,
    spanId: Math.random().toString(36).substring(2, 10),
    parentSpanId,
    type,
    ts: Date.now()
  };
}

module.exports = { createSpan };
