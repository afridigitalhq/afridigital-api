export function explainFutureFailure(probState, events) {
  const causes = [];

  for (const n of probState.nodes) {
    if (n.failureProbability > 0.5) {
      const relatedEvents = events.filter(e => e.node === n.node);

      const highLatency = relatedEvents.some(e => e.latency > 1000);
      const failures = relatedEvents.filter(e => e.status === "FAILED").length;

      causes.push({
        node: n.node,
        rootCauseSignals: [
          highLatency ? "HIGH_LATENCY_TREND" : null,
          failures > 3 ? "REPEATED_FAILURE_PATTERN" : null
        ].filter(Boolean),
        explanation:
          "Failure probability driven by sustained performance degradation and repeated execution instability"
      });
    }
  }

  return {
    causalMap: causes,
    summary:
      causes.length > 0
        ? "Emerging system instability detected through trend causality"
        : "No causal failure patterns detected",
    mode: "CAUSAL_FUTURE_ANALYSIS"
  };
}
