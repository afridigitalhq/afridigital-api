export function buildIncidentReport({ health, rca, forecast, alerts, trace }) {
  return {
    title: "AUTOMATED INCIDENT ROOT CAUSE REPORT",
    timestamp: Date.now(),

    executiveSummary: {
      systemState: health.systemState,
      successRate: health.successRate,
      riskLevel: forecast?.prediction || "UNKNOWN"
    },

    rootCauseAnalysis: rca?.causes || [],

    alertSummary: alerts?.map(a => ({
      type: a.type,
      severity: a.severity,
      message: a.message
    })),

    executionTrace: {
      node: trace?.nodeId,
      steps: trace?.steps || []
    },

    recommendationSummary: {
      note: "This report is advisory only. No automatic remediation applied."
    }
  };
}
