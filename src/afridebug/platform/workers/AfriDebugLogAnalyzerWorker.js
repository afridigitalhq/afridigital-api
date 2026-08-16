const AfriDebugLogAnalyzerWorker = {
  execute(input = {}) {
    const context = input.context || {};
    const runtime = context.runtime || input.runtime || {};

    const suppliedErrors =
      Array.isArray(runtime.errors)
        ? runtime.errors
        : Array.isArray(input.errors)
          ? input.errors
          : [];

    const suppliedWarnings =
      Array.isArray(runtime.warnings)
        ? runtime.warnings
        : Array.isArray(input.warnings)
          ? input.warnings
          : [];

    return {
      investigationId:
        input.investigationId || null,
      source:
        input.source || "runtime",
      errors: suppliedErrors.map(error => ({
        message: error?.message || String(error),
        severity: error?.severity || "error",
        source: error?.source || input.source || "runtime",
        stack: error?.stack || null
      })),
      warnings: suppliedWarnings.map(warning => ({
        message: warning?.message || String(warning),
        severity: warning?.severity || "warning",
        source: warning?.source || input.source || "runtime"
      })),
      stack:
        runtime.stack ||
        context.stack ||
        input.stack ||
        null,
      status:"LOG_ANALYSIS_COMPLETED",
      completedAt:Date.now()
    };
  }
};

export default AfriDebugLogAnalyzerWorker;
