export function generateFutureScenarios(events, options = {}) {
  const scenarios = [];

  const baseLoad = events.length;
  const failureBase = events.filter(e => e.status === "FAILED").length;

  const branches = [
    { name: "STABLE_GROWTH", loadFactor: 1.1, failureFactor: 0.9 },
    { name: "DEGRADED_PERFORMANCE", loadFactor: 1.4, failureFactor: 1.5 },
    { name: "CRITICAL_STRESS", loadFactor: 2.0, failureFactor: 3.0 },
    { name: "CASCADE_COLLAPSE", loadFactor: 2.5, failureFactor: 5.0 }
  ];

  for (const b of branches) {
    scenarios.push({
      scenario: b.name,
      projectedLoad: Math.round(baseLoad * b.loadFactor),
      projectedFailures: Math.round(failureBase * b.failureFactor),
      riskLevel:
        b.name === "CASCADE_COLLAPSE" ? "EXTREME" :
        b.name === "CRITICAL_STRESS" ? "HIGH" :
        b.name === "DEGRADED_PERFORMANCE" ? "MEDIUM" : "LOW"
    });
  }

  return {
    tree: scenarios,
    mode: "MULTI_SCENARIO_FORECAST"
  };
}
