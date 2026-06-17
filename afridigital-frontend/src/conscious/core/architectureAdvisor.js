export function suggestArchitectureEvolution(systemMetrics) {
  const suggestions = [];

  if (systemMetrics.load > 0.8) {
    suggestions.push({
      type: "SCALE_OBS_MODULES",
      reason: "High system load detected across dashboards",
      impact: "Improves observability performance"
    });
  }

  if (systemMetrics.latency > 500) {
    suggestions.push({
      type: "DECOUPLE_EVENT_STREAMS",
      reason: "Event propagation delay increasing",
      impact: "Reduces cross-dashboard lag"
    });
  }

  if (systemMetrics.failureRate > 0.2) {
    suggestions.push({
      type: "ISOLATE_FAILING_OBS_MODULE",
      reason: "Failure propagation risk detected",
      impact: "Improves system resilience"
    });
  }

  return {
    suggestions,
    mode: "ARCHITECTURE_EVOLUTION_ADVISOR_ONLY"
  };
}
