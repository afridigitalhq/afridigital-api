export function forecastFailures(events) {
  const window = events.slice(-20);

  let failureRate = 0;
  let latencyTrend = 0;

  window.forEach((e, i) => {
    if (e.status === "FAILED") failureRate++;

    if (e.latency) {
      latencyTrend += e.latency;
    }
  });

  const avgLatency = latencyTrend / (window.length || 1);
  const failureRatio = failureRate / (window.length || 1);

  const riskScore =
    (failureRatio * 0.6) +
    (avgLatency > 800 ? 0.4 : avgLatency / 2000);

  return {
    failureRatio,
    avgLatency,
    riskScore: riskScore.toFixed(3),
    prediction:
      riskScore > 0.7 ? "HIGH_RISK" :
      riskScore > 0.4 ? "MEDIUM_RISK" :
      "STABLE"
  };
}
