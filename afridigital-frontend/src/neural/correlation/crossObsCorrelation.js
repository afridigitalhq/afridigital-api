export function correlateSignals(observations) {
  const links = [];

  for (let i = 0; i < observations.length; i++) {
    for (let j = i + 1; j < observations.length; j++) {
      const a = observations[i];
      const b = observations[j];

      if (!a || !b) continue;

      // correlation heuristics (safe abstraction model)
      const sharedLatency = Math.abs((a.latency || 0) - (b.latency || 0));
      const sharedFailure = a.failures && b.failures;

      if (sharedLatency < 120 && sharedFailure) {
        links.push({
          from: a.source,
          to: b.source,
          type: "LATENCY_FAILURE_CORRELATION",
          strength: 0.7
        });
      }

      if (a.domain === "PAYMENT" && b.domain === "USER") {
        links.push({
          from: "PAYMENT",
          to: "USER",
          type: "BUSINESS_FLOW_DEPENDENCY",
          strength: 0.9
        });
      }
    }
  }

  return {
    correlations: links,
    mode: "CROSS_OBSERVABILITY_CAUSAL_MAP"
  };
}
