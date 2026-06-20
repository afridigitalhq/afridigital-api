const timeline = [];

/**
 * Append immutable event snapshot
 */
function recordEvent(event) {
  timeline.push({
    id: timeline.length + 1,
    ts: Date.now(),
    type: event.type,
    traceId: event.traceId || 'system',
    payload: event.payload || {}
  });
}

/**
 * Replay full timeline OR filtered trace
 */
function replay(traceId = null) {
  return timeline.filter(e =>
    traceId ? e.traceId === traceId : true
  );
}

/**
 * Get snapshot at time range
 */
function atTime(from, to) {
  return timeline.filter(e => e.ts >= from && e.ts <= to);
}

module.exports = {
  recordEvent,
  replay,
  atTime,
  _timeline: timeline
};
