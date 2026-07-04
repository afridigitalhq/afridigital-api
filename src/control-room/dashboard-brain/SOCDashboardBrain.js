import { socDecisionOrchestrator } from "../orchestrator/SOCDecisionOrchestrator.js";
import { socReasoningEngine } from "../reasoning/SOCReasoningEngine.js";
import { socGlobalMemoryIndex } from "../memory/SOCGlobalMemoryIndex.js";

export class SOCDashboardBrain {
  snapshot(timeWindowMs = 300000) {

    const decision = socDecisionOrchestrator.decide(timeWindowMs);
    const reasoning = socReasoningEngine.reason(timeWindowMs);
    const memory = socGlobalMemoryIndex.getFullMemory();

    return {
      timestamp: Date.now(),

      systemOverview: {
        threatLevel: decision.systemState.threatLevel,
        mode: decision.controlRecommendation,
        stability: decision.systemState.stability
      },

      liveDecision: decision.prioritizedActions,

      reasoningFlow: reasoning.insights,

      causalSummary: decision.causalSummary,

      memorySnapshot: memory.slice(-10),

      healthIndicators: {
        patternDensity: memory.length,
        reasoningConfidence: reasoning.insights.reduce((acc, i) => acc + (i.confidence || 0), 0)
      }
    };
  }
}

export const socDashboardBrain = new SOCDashboardBrain();
