export function inferCausalGraph(events) {
  const graph = {};

  for (const e of events) {
    if (!graph[e.node]) {
      graph[e.node] = {
        dependencies: new Set(),
        influenceScore: 0,
        failureTriggers: 0
      };
    }

    const node = graph[e.node];

    if (e.triggeredBy) {
      node.dependencies.add(e.triggeredBy);
    }

    if (e.status === "FAILED") {
      node.failureTriggers += 1;
      node.influenceScore += 0.2;
    }

    if (e.latency > 500) {
      node.influenceScore += 0.1;
    }
  }

  const result = Object.entries(graph).map(([id, n]) => ({
    node: id,
    dependencies: Array.from(n.dependencies),
    influenceScore: Number(n.influenceScore.toFixed(2)),
    riskClass:
      n.influenceScore > 1
        ? "HIGH_INFLUENCE_NODE"
        : n.influenceScore > 0.5
        ? "MEDIUM_INFLUENCE"
        : "LOW_INFLUENCE"
  }));

  return {
    causalGraph: result,
    mode: "NEURAL_CAUSAL_INFERENCE"
  };
}
