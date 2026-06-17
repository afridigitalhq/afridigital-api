export function generateIncidentSuggestions({ alerts, rca, forecast }) {
  const suggestions = [];

  for (const a of alerts || []) {
    if (a.type === "FAILURE_ALERT") {
      suggestions.push({
        issue: "Node failure detected",
        suggestion: "Inspect node execution logs and recent deployment changes",
        priority: "HIGH"
      });
    }

    if (a.type === "LATENCY_ALERT") {
      suggestions.push({
        issue: "High latency detected",
        suggestion: "Check downstream dependencies and reduce execution load",
        priority: "MEDIUM"
      });
    }
  }

  if (forecast?.prediction === "HIGH_RISK") {
    suggestions.push({
      issue: "System instability predicted",
      suggestion: "Review high-load nodes and reduce concurrency pressure",
      priority: "CRITICAL"
    });
  }

  if (!alerts?.length) {
    suggestions.push({
      issue: "No active incidents",
      suggestion: "System operating normally. No action required",
      priority: "LOW"
    });
  }

  return suggestions;
}
