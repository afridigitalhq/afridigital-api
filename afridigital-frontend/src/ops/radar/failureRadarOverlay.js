export function buildFailureRadar(probState, causalMap) {
  const radar = [];

  for (const n of probState.nodes) {
    const causal = causalMap.find(c => c.node === n.node);

    radar.push({
      node: n.node,
      intensity: n.failureProbability * 100,
      ring:
        n.failureProbability > 0.7 ? "INNER_RED_ZONE" :
        n.failureProbability > 0.4 ? "MID_ORANGE_ZONE" :
        "OUTER_SAFE_ZONE",
      causeSignal: causal?.rootCauseSignals || []
    });
  }

  return {
    radar,
    globalThreatLevel:
      radar.some(r => r.intensity > 70)
        ? "CRITICAL"
        : radar.some(r => r.intensity > 40)
        ? "ELEVATED"
        : "STABLE",
    mode: "PREDICTIVE_RISK_VISUALIZATION"
  };
}
