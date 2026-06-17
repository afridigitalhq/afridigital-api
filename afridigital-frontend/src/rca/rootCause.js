import { detectAnomalies } from "../intelligence/anomaly";

export function analyzeRootCause(events) {
  const anomalies = detectAnomalies(events);

  const causes = [];

  for (const a of anomalies) {

    if (a.type === "FAILURE_STREAK") {
      const lastFail = [...events]
        .reverse()
        .find(e => e.status === "FAILED");

      causes.push({
        type: "FAILURE_CHAIN",
        explanation: "Repeated node execution failures detected",
        likely_source: lastFail?.node || "UNKNOWN",
        confidence: 0.78
      });
    }

    if (a.type === "LATENCY_SPIKE") {
      const culprit = events.find(e => e.node === a.node);

      causes.push({
        type: "PERFORMANCE_DEGRADATION",
        explanation: "High latency detected in execution path",
        likely_source: a.node,
        confidence: culprit?.latency > 2000 ? 0.9 : 0.6
      });
    }
  }

  // cross-correlation heuristic
  const heavyNodes = events.filter(e => e.execLoad > 80);

  if (heavyNodes.length > 0) {
    causes.push({
      type: "RESOURCE_CONTENTION",
      explanation: "High execution load concentration detected",
      likely_source: heavyNodes.map(n => n.node),
      confidence: 0.72
    });
  }

  return {
    anomalies,
    causes,
    summary: generateSummary(causes)
  };
}

function generateSummary(causes) {
  if (!causes.length) return "System operating within normal parameters.";

  const primary = causes[0];

  return `Primary issue: ${primary.type} affecting execution stability.`;
}
