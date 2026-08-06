const CoreIntelligenceEngine = {
  analyze(input = {}, context = {}) {
    const logs = input.logs || [];
    const findings = [];

    for (const log of logs) {
      const text = JSON.stringify(log).toLowerCase();

      if (text.includes("error")) findings.push({severity:"HIGH",type:"ERROR_LOG",source:log.file||"unknown"});
      if (text.includes("exception")) findings.push({severity:"HIGH",type:"EXCEPTION",source:log.file||"unknown"});
      if (text.includes("timeout")) findings.push({severity:"MEDIUM",type:"TIMEOUT",source:log.file||"unknown"});
      if (text.includes("deprecated")) findings.push({severity:"LOW",type:"DEPRECATION",source:log.file||"unknown"});
    }

    return {
      input,
      context,
      summary:{
        repository:context.repository?.name || "unknown",
        runtime:context.runtime?.status || "UNKNOWN",
        logCount:logs.length,
        findingCount:findings.length
      },
      findings,
      confidence:findings.length ? 0.9 : 0.2,
      generatedAt:new Date().toISOString(),
      status:"ANALYZED"
    };
  }
};

export default CoreIntelligenceEngine;
