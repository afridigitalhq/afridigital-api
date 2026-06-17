export function propagateHeat(nodes, edges, anomalies) {
  const heatMap = {};

  nodes.forEach(n => {
    heatMap[n.id] = 0;
  });

  // Base anomaly heat
  anomalies.forEach(a => {
    if (a.node) heatMap[a.node] += 5;
  });

  // Propagate through edges (causal spread)
  edges.forEach(e => {
    const fromHeat = heatMap[e.from] || 0;

    if (fromHeat > 0) {
      heatMap[e.to] = (heatMap[e.to] || 0) + fromHeat * 0.6;
    }
  });

  const normalized = Object.entries(heatMap).map(([node, heat]) => ({
    node,
    heat: Math.min(10, heat)
  }));

  return {
    heatmap: normalized,
    mode: "CAUSAL_PROPAGATION_SIMULATION"
  };
}
