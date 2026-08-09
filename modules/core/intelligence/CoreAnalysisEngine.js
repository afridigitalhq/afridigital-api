const CoreAnalysisEngine = {
  analyze(data = {}) {
    const findings = data.findings || [];

    const repository =
      typeof data.summary?.repository === "string" && data.summary.repository !== "unknown"
        ? data.summary.repository
        : typeof data.context?.repository === "string"
          ? data.context.repository
          : typeof data.input?.context?.repository === "string"
            ? data.input.context.repository
            : typeof data.input?.summary?.repository === "string"
              ? data.input.summary.repository
              : "unknown";

    return {
      input: data,
      summary: {
        repository,
        logCount: data.summary?.logCount || data.input?.summary?.logCount || 0,
        findingCount: findings.length
      },
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
