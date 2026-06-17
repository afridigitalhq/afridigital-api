export function generateProfitOptimizations(state) {
  const suggestions = [];

  const margin = state.revenue - state.cost;

  if (margin < 0) {
    suggestions.push({
      type: "REDUCE_INFRA_COST",
      impact: "HIGH",
      reason: "Negative profit margin detected",
      estimatedGain: "+15% margin improvement"
    });
  }

  if (state.latency > 500) {
    suggestions.push({
      type: "OPTIMIZE_INFRASTRUCTURE_PATHS",
      impact: "MEDIUM",
      reason: "Latency impacting conversion rate",
      estimatedGain: "+8% revenue lift"
    });
  }

  if (state.userDropRate > 0.2) {
    suggestions.push({
      type: "IMPROVE_USER_RETENTION_FLOW",
      impact: "HIGH",
      reason: "User churn affecting lifetime value",
      estimatedGain: "+20% LTV improvement"
    });
  }

  return {
    suggestions,
    mode: "PROFIT_AWARE_ADVISORY_ONLY"
  };
}
