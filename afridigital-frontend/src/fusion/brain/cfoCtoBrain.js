export function unifiedExecutiveBrain(metrics) {
  const revenue = metrics.revenue || 0;
  const infraCost = metrics.infrastructureCost || 0;
  const latency = metrics.latency || 0;
  const users = metrics.users || 1;

  const margin = revenue - infraCost;
  const efficiency = revenue / (infraCost || 1);

  const infraRisk = latency > 600 ? "HIGH" : "STABLE";
  const financialRisk = margin < 0 ? "LOSS_ZONE" : "HEALTHY";

  const decisionState =
    infraRisk === "HIGH" && financialRisk === "LOSS_ZONE"
      ? "CRITICAL_DUAL_RISK"
      : infraRisk === "HIGH"
      ? "INFRASTRUCTURE_PRIORITY"
      : financialRisk === "LOSS_ZONE"
      ? "FINANCIAL_OPTIMIZATION_REQUIRED"
      : "OPTIMAL_STATE";

  return {
    cfoView: {
      revenue,
      margin,
      efficiency,
      financialRisk
    },
    ctoView: {
      latency,
      infraRisk,
      users
    },
    unifiedDecisionState: decisionState,
    mode: "AI_CFO_CTO_FUSED_BRAIN"
  };
}
