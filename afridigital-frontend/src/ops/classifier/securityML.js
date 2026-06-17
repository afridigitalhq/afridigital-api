export function classifySecurityAnomalies(events) {
  const results = [];

  for (const e of events) {
    let score = 0;

    if (e.suspicious) score += 0.5;
    if (e.rateLimitViolation) score += 0.3;
    if (e.unusualPattern) score += 0.4;
    if (e.geoMismatch) score += 0.6;

    const label =
      score > 0.7 ? "HIGH_RISK" :
      score > 0.4 ? "MEDIUM_RISK" :
      "LOW_RISK";

    results.push({
      node: e.node,
      score: score.toFixed(2),
      label
    });
  }

  return {
    classified: results,
    summary: {
      high: results.filter(r => r.label === "HIGH_RISK").length,
      medium: results.filter(r => r.label === "MEDIUM_RISK").length,
      low: results.filter(r => r.label === "LOW_RISK").length
    }
  };
}
