import { socLearningLoop } from "../learning/SOCLearningLoop.js";

export class SOCGlobalMemoryIndex {
  constructor() {
    this.globalIndex = new Map();
  }

  ingestLearningSnapshot() {
    const knowledge = socLearningLoop.getKnowledgeBase();

    for (const [pattern, data] of knowledge) {
      if (!this.globalIndex.has(pattern)) {
        this.globalIndex.set(pattern, {
          total: 0,
          history: []
        });
      }

      const entry = this.globalIndex.get(pattern);

      entry.total += data.count;
      entry.history.push({
        timestamp: Date.now(),
        frequency: data.count
      });
    }

    return {
      indexedPatterns: this.globalIndex.size,
      snapshotAt: Date.now()
    };
  }

  querySimilar(pattern) {
    return this.globalIndex.get(pattern) || null;
  }

  getFullMemory() {
    return Array.from(this.globalIndex.entries()).map(([k, v]) => ({
      pattern: k,
      totalOccurrences: v.total,
      historyLength: v.history.length
    }));
  }
}

export const socGlobalMemoryIndex = new SOCGlobalMemoryIndex();
