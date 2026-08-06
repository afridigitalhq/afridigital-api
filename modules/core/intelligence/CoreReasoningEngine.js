const CoreReasoningEngine = {
  reason(context = {}) {
    const matches = context.matches || [];

    return {
      context,
      reasoning: matches.length
        ? `Detected ${matches.length} matching pattern(s).`
        : "No known patterns matched. Further investigation required.",
      confidence: matches.length ? 0.85 : 0.2,
      generatedAt: new Date().toISOString(),
      status: "REASONED"
    };
  }
};

export default CoreReasoningEngine;
