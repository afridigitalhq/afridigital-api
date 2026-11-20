const AfriIntelReportService = {
  create({ query, evidence = [], correlations = [] } = {}) {
    if (typeof query !== "string" || !query.trim()) {
      throw new Error("AFRI_INTEL_REPORT_QUERY_REQUIRED");
    }
    if (!Array.isArray(evidence) || !Array.isArray(correlations)) {
      throw new Error("AFRI_INTEL_REPORT_DATA_INVALID");
    }

    return Object.freeze({
      reportType: "AFRI_INTEL_RESEARCH",
      query: query.trim(),
      generatedAt: new Date().toISOString(),
      evidenceCount: evidence.length,
      correlationCount: correlations.length,
      evidence,
      correlations
    });
  }
};

export default AfriIntelReportService;
