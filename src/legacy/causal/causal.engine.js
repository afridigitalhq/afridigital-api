const causalGraph = [];

function recordCausal(event) {
  causalGraph.push({
    ...event,
    ts: Date.now()
  });
}

function explain(nodeId) {
  const chain = causalGraph.filter(n => n.nodeId === nodeId);

  return chain.map(step => ({
    event: step.event,
    reason:
      step.metrics?.load > 0.7 ? "high load pressure adaptation" :
      step.metrics?.fail ? "failure-driven correction" :
      "system emergence",
    ts: step.ts
  }));
}

module.exports = { recordCausal, explain };
