export function generateRecommendations(systemState, probabilisticState) {
  const recommendations = [];

  for (const node of probabilisticState.nodes) {
    if (node.failureProbability > 0.7) {
      recommendations.push({
        node: node.node,
        action: "SCALE_RESOURCES",
        confidence: 0.82,
        reason: "High failure probability detected",
        impact: "Reduces predicted instability"
      });
    }

    if (node.avgLatency > 800) {
      recommendations.push({
        node: node.node,
        action: "OPTIMIZE_LATENCY_PATH",
        confidence: 0.74,
        reason: "Sustained latency degradation",
        impact: "Improves DAG execution stability"
      });
    }

    if (systemState === "CRITICAL") {
      recommendations.push({
        node: "GLOBAL",
        action: "FREEZE_NON_CRITICAL_TASKS",
        confidence: 0.91,
        reason: "System-wide instability detected",
        impact: "Prevents cascade failure propagation"
      });
    }
  }

  return {
    recommendations,
    mode: "ADVISORY_ONLY_NO_EXECUTION"
  };
}
