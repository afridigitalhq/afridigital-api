const bus = require('../../redis/streamBus');

const STREAM_KEY = 'flowgraph:trace';

/**
 * AI Decision Trace Packet
 * This represents "thought → decision → action"
 */
function emitTrace(trace) {
  const packet = {
    id: 'trace_' + Date.now(),
    timestamp: Date.now(),

    // core cognition fields
    model: trace.model || 'afriai-core',
    input: trace.input || null,
    reasoning: trace.reasoning || null,
    confidence: trace.confidence ?? 1,

    // decision layer
    decision: trace.decision || null,
    action: trace.action || null,

    // context
    node: trace.node || 'AI Brain',
    traceId: trace.traceId || null,
    userId: trace.userId || null
  };

  try {
    if (bus && bus.xadd) {
      bus.xadd(STREAM_KEY, '*', 'data', JSON.stringify(packet));
    } else if (bus && bus.publish) {
      bus.publish(STREAM_KEY, packet);
    }
  } catch (e) {
    console.log('[TraceEngine] fallback:', e.message);
  }

  return packet;
}

/**
 * Example wrapper for AI calls
 */
function wrapAIDecision(input, output) {
  return emitTrace({
    input,
    reasoning: output?.reasoning || 'auto-inferred reasoning layer',
    decision: output?.decision || 'unknown',
    action: output?.action || 'noop',
    confidence: output?.confidence || 0.5,
    traceId: output?.traceId
  });
}

module.exports = {
  emitTrace,
  wrapAIDecision
};
