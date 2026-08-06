const CorePatternAnalyzer = {
  match(input = {}, patterns = []) {
    const findings = [];

    for (const pattern of patterns) {
      if (
        pattern?.keyword &&
        JSON.stringify(input).toLowerCase().includes(pattern.keyword.toLowerCase())
      ) {
        findings.push(pattern);
      }
    }

    return {
      input,
      patterns,
      matches: findings,
      matchCount: findings.length,
      analyzedAt: new Date().toISOString(),
      status: "MATCHED"
    };
  }
};

export default CorePatternAnalyzer;
