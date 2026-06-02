const mirror = require('./event.mirror');

/**
 * Builds causal chains from event stream
 * PURE READ-ONLY ANALYSIS LAYER
 */
function buildTrace(traceId) {
  const events = mirror.query(traceId);

  const chain = [];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];

    chain.push({
      node: e.type,
      stage: e.stage,
      ts: e.ts,
      payload: e.payload,
      linksTo: events[i + 1] ? events[i + 1].type : null
    });
  }

  return {
    traceId,
    length: chain.length,
    chain
  };
}

/**
 * Simple causal dependency map
 */
function buildCausalGraph(traceId) {
  const trace = buildTrace(traceId);

  const nodes = new Set();
  const edges = [];

  trace.chain.forEach(step => {
    nodes.add(step.node);
    if (step.linksTo) {
      edges.push({
        from: step.node,
        to: step.linksTo
      });
    }
  });

  return {
    traceId,
    nodes: Array.from(nodes),
    edges
  };
}

module.exports = {
  buildTrace,
  buildCausalGraph
};
