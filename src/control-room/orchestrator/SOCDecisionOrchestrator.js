import { socReasoningEngine } from "../reasoning/SOCReasoningEngine.js";
import { socAutopilotEngine } from "../autopilot/SOCAutopilotEngine.js";
import { autonomousThreatResponseAgent } from "../response/AutonomousThreatResponseAgent.js";
import { rootCauseAnalyzer } from "../rca/RootCauseAnalyzer.js";

export class SOCDecisionOrchestrator {
  decide(timeWindowMs = 300000) {

    const reasoning = socReasoningEngine.reason(timeWindowMs);
    const rca = rootCauseAnalyzer.analyze(timeWindowMs);

    const autopilotActions = socAutopilotEngine.proposeActions(timeWindowMs);

    const threatLevel = this._computeThreatLevel(rca);

    const decision = {
      timestamp: Date.now(),

      systemState: {
        threatLevel,
        stability: reasoning.insights.find(i => i.type === "SYSTEM_COMPLEXITY")?.interpretation || "UNKNOWN"
      },

      prioritizedActions: this._prioritizeActions(autopilotActions, threatLevel),

      reasoningSummary: reasoning.insights,

      causalSummary: rca.hypotheses || [],

      controlRecommendation: this._controlPolicy(threatLevel)
    };

    return decision;
  }

  _computeThreatLevel(rca) {
    const score = (rca.chainsDetected || 0);

    if (score > 10) return "CRITICAL";
    if (score > 5) return "HIGH";
    if (score > 2) return "MEDIUM";
    return "LOW";
  }

  _prioritizeActions(actions, threatLevel) {
    return actions
      .map((a) => ({
        ...a,
        priority:
          threatLevel === "CRITICAL" ? 1 :
          threatLevel === "HIGH" ? 2 : 3
      }))
      .sort((a, b) => a.priority - b.priority);
  }

  _controlPolicy(threatLevel) {
    if (threatLevel === "CRITICAL") {
      return "AUTO_RESPONSE_ACTIVE";
    }

    if (threatLevel === "HIGH") {
      return "AUTOPILOT_REQUIRED";
    }

    return "MONITOR_ONLY";
  }
}

export const socDecisionOrchestrator = new SOCDecisionOrchestrator();
