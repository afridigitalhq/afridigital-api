export function evolveNodes(liveGraph) {
  const evolved = [];

  for (const node of liveGraph.nodes.values()) {
    const drift = (Math.random() - 0.5) * 0.1;

    const newRisk = Math.min(
      1,
      Math.max(0, (node.risk || 0.2) + drift)
    );

    evolved.push({
      ...node,
      risk: newRisk,
      evolved: true,
      stability: 1 - newRisk
    });
  }

  return evolved;
}
