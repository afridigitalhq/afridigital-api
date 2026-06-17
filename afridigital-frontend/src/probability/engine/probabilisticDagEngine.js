export function computeProbabilisticState(events) {
  const nodes = {};

  for (const e of events) {
    if (!nodes[e.node]) {
      nodes[e.node] = {
        success: 0,
        failure: 0,
        latency: []
      };
    }

    const n = nodes[e.node];

    if (e.status === "SUCCESS") n.success++;
    if (e.status === "FAILED") n.failure++;

    if (e.latency) n.latency.push(e.latency);
  }

  const output = Object.entries(nodes).map(([id, n]) => {
    const total = n.success + n.failure;

    const failureProb = total ? n.failure / total : 0;

    const avgLatency =
      n.latency.reduce((a, b) => a + b, 0) / (n.latency.length || 1);

    return {
      node: id,
      failureProbability: Number(failureProb.toFixed(3)),
      avgLatency,
      stability:
        failureProb > 0.6 ? "UNSTABLE" :
        failureProb > 0.3 ? "DEGRADED" :
        "STABLE"
    };
  });

  return {
    nodes: output,
    systemRisk:
      output.some(n => n.failureProbability > 0.7)
        ? "CRITICAL"
        : "NORMAL",
    mode: "PROBABILISTIC_EXECUTION_MODEL"
  };
}
