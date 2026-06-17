
module.exports = {
  normalize(event) {
    return {
      traceId: event.traceId || 'no-trace',
      source: event.source || 'unknown',
      stage: event.stage || 'unknown',
      timestamp: Date.now(),
      payload: event.payload || {}
    };
  }
};
