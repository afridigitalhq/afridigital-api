const CoreAnalysisEngine = {
  analyze(data = {}) {
    const findings = data.findings || [];

    return {
      input: data,
      metrics: {
        logCount: data.summary?.logCount || 0,
        findingCount: findings.length,
        highSeverity: findings.filter(f => f.severity === "HIGH").length,
        mediumSeverity: findings.filter(f => f.severity === "MEDIUM").length,
        lowSeverity: findings.filter(f => f.severity === "LOW").length
      },
      analyzedAt: new Date().toISOString(),
      status: "ANALYSIS_COMPLETED"
    };
  }
};

export default CoreAnalysisEngine;
