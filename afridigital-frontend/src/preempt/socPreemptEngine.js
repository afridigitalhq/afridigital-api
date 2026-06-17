export function detectPreemptiveAnomalies(liveGraph) {
  const warnings = [];

  for (const node of liveGraph.nodes.values()) {
    const risk = node.risk || 0;

    if (risk > 0.65 && risk < 0.85) {
      warnings.push({
        type: "PRE_FAILURE_WARNING",
        node: node.id,
        severity: "EARLY_STAGE_ANOMALY",
        confidence: risk,
        message: "System instability trend detected BEFORE threshold breach"
      });
    }
  }

  return {
    warnings,
    status: warnings.length > 0 ? "DEGRADING" : "STABLE"
  };
}
