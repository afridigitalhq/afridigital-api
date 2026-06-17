export function explainSystem(events, probState, causalGraph) {
  const criticalNodes = probState.nodes
    .filter(n => n.failureProbability > 0.5)
    .map(n => n.node);

  const causalHotspots = causalGraph.causalGraph
    .filter(n => n.influenceScore > 0.5);

  const summary =
    criticalNodes.length === 0
      ? "System is stable with no significant risk signals."
      : `System instability detected in ${criticalNodes.length} node(s).`;

  const explanation =
    causalHotspots.length > 0
      ? "High influence nodes are propagating degradation through dependency chains."
      : "No major causal propagation detected.";

  const narrative =
    `${summary} ${explanation} ` +
    `Key affected nodes: ${criticalNodes.join(", ") || "none"}.`;

  return {
    narrative,
    mode: "SELF_EXPLAINING_DAG"
  };
}
