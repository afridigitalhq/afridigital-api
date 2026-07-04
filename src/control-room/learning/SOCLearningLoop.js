import { forensicCaseExporter } from "../forensics/ForensicCaseExporter.js";
import { rootCauseAnalyzer } from "../rca/RootCauseAnalyzer.js";

export class SOCLearningLoop {
  constructor() {
    this.patterns = new Map();
  }

  learn(timeWindowMs = 300000) {
    const caseFile = forensicCaseExporter.buildCase(timeWindowMs);

    const rca = caseFile.rootCauseAnalysis;

    for (const h of rca.hypotheses || []) {
      const key = h.hypothesis;

      if (!this.patterns.has(key)) {
        this.patterns.set(key, {
          count: 0,
          lastSeen: null
        });
      }

      const entry = this.patterns.get(key);
      entry.count += 1;
      entry.lastSeen = Date.now();
    }

    return {
      totalPatterns: this.patterns.size,
      latestCase: caseFile.caseId,
      learnedPatterns: Array.from(this.patterns.entries()).map(([k, v]) => ({
        pattern: k,
        frequency: v.count
      }))
    };
  }

  getKnowledgeBase() {
    return Array.from(this.patterns.entries());
  }
}

export const socLearningLoop = new SOCLearningLoop();
