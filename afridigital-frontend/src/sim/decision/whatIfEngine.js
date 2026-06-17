export function simulateDecision(events, scenario) {
  const modified = [...events];

  if (scenario.type === "NODE_REMOVAL") {
    return {
      result: "SIMULATED_NODE_FAILURE",
      impact: "Reduced DAG connectivity",
      affectedNodes: scenario.nodes
    };
  }

  if (scenario.type === "LATENCY_INJECTION") {
    const impacted = modified.filter(e =>
      scenario.nodes.includes(e.node)
    );

    return {
      result: "LATENCY_SPIKE_SIMULATION",
      avgLatencyIncrease: "42%",
      impactedNodes: impacted.length
    };
  }

  if (scenario.type === "REGION_DROP") {
    return {
      result: "REGION_DISCONNECT",
      impact: "Cross-cluster degradation simulated",
      severity: "HIGH"
    };
  }

  return {
    result: "NO_CHANGE",
    message: "Scenario not recognized"
  };
}
