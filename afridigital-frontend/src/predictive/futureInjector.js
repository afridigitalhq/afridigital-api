export function injectFutureEvents(liveGraph, horizon = 10) {
  const predictions = [];

  const nodes = Array.from(liveGraph.nodes.values());

  for (let i = 0; i < horizon; i++) {
    const base = nodes[Math.floor(Math.random() * nodes.length)];

    if (!base) continue;

    predictions.push({
      type: "FUTURE_NODE_STATE",
      node: base.id,
      predictedRisk: Math.min(1, (base.risk || 0) + Math.random() * 0.3),
      ts: Date.now() + i * 5000,
      simulated: true
    });
  }

  return predictions;
}
