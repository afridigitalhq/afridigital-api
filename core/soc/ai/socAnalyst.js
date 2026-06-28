export class SOCAnalyst {
  analyze(event) {
    return {
      suggestion: "Monitor anomaly pattern",
      confidence: 0.72,
      action: "SUGGEST_ONLY"
    };
  }
}
