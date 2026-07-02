const { _timeline } = require('./time.engine');

/**
 * Backtrace causal chain for a traceId
 */
function explain(traceId) {
  const chain = _timeline.filter(e => e.traceId === traceId);

  return chain.map((e, i) => ({
    step: i + 1,
    type: e.type,
    why: deriveReason(e)
  }));
}

function deriveReason(event) {
  if (event.type === 'AI_REQUEST') return 'User triggered inference';
  if (event.type === 'SYSTEM_ERROR') return 'Runtime failure detected';
  if (event.type === 'ROUTE_LEARN') return 'Adaptive routing feedback';
  return 'System event propagation';
}

module.exports = { explain };
