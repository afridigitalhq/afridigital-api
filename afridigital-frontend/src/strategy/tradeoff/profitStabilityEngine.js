export function computeTradeoff(state) {
  const profitScore = (state.revenue - state.cost) / (state.revenue || 1);
  const stabilityScore = 1 - (state.latency / 1000);

  const decisionSurface =
    profitScore > 0.6 && stabilityScore > 0.6
      ? "SCALE_AGGRESSIVELY"
      : profitScore < 0.3 && stabilityScore > 0.6
      ? "OPTIMIZE_MONETIZATION"
      : profitScore > 0.6 && stabilityScore < 0.5
      ? "OPTIMIZE_INFRASTRUCTURE"
      : "RISK_BALANCED_MODE";

  return {
    profitScore,
    stabilityScore,
    decisionSurface,
    tensionIndex: Math.abs(profitScore - stabilityScore),
    mode: "PROFIT_STABILITY_FUSION_ENGINE"
  };
}
