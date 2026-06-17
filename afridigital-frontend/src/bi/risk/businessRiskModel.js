export function computeBusinessRisk(metrics) {
  const churn = metrics.churnRate || 0;
  const outage = metrics.systemDowntime || 0;
  const failedTx = metrics.failedTransactions || 0;

  const riskScore =
    (churn * 0.4) +
    (outage * 0.3) +
    (failedTx * 0.3);

  return {
    riskScore,
    status:
      riskScore > 0.7 ? "CRITICAL" :
      riskScore > 0.4 ? "ELEVATED" :
      "STABLE",
    drivers: {
      churn,
      outage,
      failedTx
    },
    mode: "BUSINESS_RISK_INTELLIGENCE"
  };
}
